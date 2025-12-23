import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import './ReservationList.css';

interface ReservationListProps {
  date: string;
  onClose: () => void;
}

const ReservationList: React.FC<ReservationListProps> = ({ date, onClose }) => {
  const { getReservationsByDate, userRole, currentCustomer } = useApp();
  const { language, t } = useLanguage();
  const reservations = getReservationsByDate(date);

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString(language === 'ro' ? 'ro-RO' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content reservation-list-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('reservationsFor')} {formattedDate}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {reservations.length === 0 ? (
            <p className="no-reservations">{t('noReservations')}</p>
          ) : (
            <div className="reservations-list">
              {reservations.map((reservation) => (
                <div key={reservation.id} className={`reservation-item ${currentCustomer && reservation.customerId === currentCustomer.id ? 'own-reservation' : ''}`}>
                  <div className="reservation-time">{reservation.timeSlot}</div>
                  <div className="reservation-customer">
                    <strong>{reservation.customerName}</strong>
                    {currentCustomer && reservation.customerId === currentCustomer.id && (
                      <span className="own-badge"> ({t('yourBooking' as any)})</span>
                    )}
                    {userRole === 'trainer' && (
                      <span className="reservation-id">ID: {reservation.customerId}</span>
                    )}
                  </div>
                  {reservation.description && (
                    <div className="reservation-description">
                      <strong>{t('description')}:</strong> {reservation.description}
                    </div>
                  )}
                  <div className="reservation-date">
                    {t('created')}: {new Date(reservation.createdAt).toLocaleString(language === 'ro' ? 'ro-RO' : 'en-US')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationList;

