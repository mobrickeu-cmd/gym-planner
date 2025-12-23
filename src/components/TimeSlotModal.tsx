import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { generateTimeSlots, formatDate } from '../utils/dateUtils';
import './TimeSlotModal.css';

interface TimeSlotModalProps {
  date: { year: number; month: number; day: number };
  onClose: () => void;
}

const TimeSlotModal: React.FC<TimeSlotModalProps> = ({ date, onClose }) => {
  const { userRole, currentCustomer, addReservation, timeRangeSettings, getReservationsByDate } = useApp();
  const { language, t } = useLanguage();
  const { showNotification } = useNotification();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const timeSlots = generateTimeSlots(timeRangeSettings.startHour, timeRangeSettings.endHour);
  const dateStr = formatDate(date.year, date.month, date.day);
  const reservationsForDate = getReservationsByDate(dateStr);

  const getReservationsForSlot = (slot: string): number => {
    return reservationsForDate.filter(r => r.timeSlot === slot).length;
  };

  const getExistingReservationsForSelectedSlot = () => {
    if (!selectedSlot) return [];
    return reservationsForDate.filter(r => r.timeSlot === selectedSlot);
  };

  const isSlotFull = (slot: string): boolean => {
    const currentReservations = getReservationsForSlot(slot);
    return currentReservations >= timeRangeSettings.maxReservationsPerSlot;
  };

  const handleReservation = () => {
    if (!selectedSlot) {
      showNotification(t('selectTimeSlotAlert'), 'error');
      return;
    }


    // Check if slot is full
    if (isSlotFull(selectedSlot)) {
      const reservationWord = timeRangeSettings.maxReservationsPerSlot === 1 ? t('reservation') : t('reservations');
      showNotification(`${t('slotFull')} (${timeRangeSettings.maxReservationsPerSlot} ${reservationWord}).`, 'error');
      return;
    }

    if (userRole === 'customer') {
      if (!currentCustomer) {
        showNotification(t('setupProfileFirst'), 'error');
        onClose();
        return;
      }

      if (currentCustomer.sessions <= 0) {
        showNotification(t('noSessionsRemaining'), 'error');
        onClose();
        return;
      }
    }

    const reservation = {
      id: Date.now().toString(),
      customerId: currentCustomer?.id || 'trainer',
      customerName: currentCustomer?.name || t('gymTrainer'),
      date: dateStr,
      timeSlot: selectedSlot,
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };

    addReservation(reservation);
    showNotification(`${t('reservationConfirmed')} ${dateStr} ${t('at')} ${selectedSlot}`, 'success');
    setDescription('');
    onClose();
  };

  const canMakeReservation = userRole === 'trainer' || (currentCustomer && currentCustomer.sessions > 0);

  const canSelectSlot = (slot: string): boolean => {
    if (!canMakeReservation) return false;
    return !isSlotFull(slot);
  };

  const handleClose = () => {
    setDescription('');
    setSelectedSlot(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('selectTimeSlot')}</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        <div className="modal-body">
          <p className="date-display">
            {new Date(date.year, date.month, date.day).toLocaleDateString(language === 'ro' ? 'ro-RO' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {userRole === 'customer' && currentCustomer && (
            <p className="sessions-info">
              {t('remainingSessionsLabel')}: {currentCustomer.sessions}
            </p>
          )}
          {!canMakeReservation && (
            <p className="error-message">{t('cannotMakeReservations')}</p>
          )}
          <div className="time-slots-grid">
            {timeSlots.map((slot) => {
              const reservationCount = getReservationsForSlot(slot);
              const isFull = isSlotFull(slot);
              const canSelect = canSelectSlot(slot);

              return (
                <div key={slot} className="time-slot-wrapper">
                  <button
                    className={`time-slot ${selectedSlot === slot ? 'selected' : ''} ${isFull ? 'full' : ''}`}
                    onClick={() => canSelect && setSelectedSlot(slot)}
                    disabled={!canSelect}
                  >
                    {slot}
                  </button>
                  <div className="slot-reservation-info">
                    {reservationCount > 0 && (
                      <span className={`reservation-count ${isFull ? 'full' : ''}`}>
                        {reservationCount}/{timeRangeSettings.maxReservationsPerSlot} {t('reservations')}
                      </span>
                    )}
                    {isFull && (
                      <span className="full-indicator">{t('full')}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {userRole === 'trainer' && selectedSlot && getExistingReservationsForSelectedSlot().length > 0 && (
            <div className="existing-reservations">
              <h3 className="existing-reservations-title">{t('existingReservations')}</h3>
              <ul className="reservation-details-list">
                {getExistingReservationsForSelectedSlot().map((res) => (
                  <li key={res.id} className="reservation-detail-item">
                    <span className="res-customer-name"><strong>{res.customerName}:</strong></span>
                    <span className="res-description">{res.description || `(${t('noDescription')})`}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedSlot && (
            <>
              <div className="reservation-actions">
                <button className="cancel-button" onClick={handleClose}>
                  {t('cancel')}
                </button>
                <button
                  className="confirm-button"
                  onClick={handleReservation}
                  disabled={!selectedSlot || !canMakeReservation}
                >
                  {t('confirmReservation')}
                </button>
              </div>

              <div className="description-section">
                <label htmlFor="description" className="description-label">
                  {t('description')}
                </label>
                <textarea
                  id="description"
                  className="description-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('descriptionPlaceholder')}
                  rows={2}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotModal;

