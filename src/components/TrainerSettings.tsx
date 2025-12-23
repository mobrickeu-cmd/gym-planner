import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import CustomerManagement from './CustomerManagement';
import './TrainerSettings.css';

const TrainerSettings: React.FC = () => {
  const { timeRangeSettings, updateTimeRangeSettings } = useApp();
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const [startHour, setStartHour] = useState(timeRangeSettings.startHour);
  const [endHour, setEndHour] = useState(timeRangeSettings.endHour);
  const [maxReservationsPerSlot, setMaxReservationsPerSlot] = useState(
    timeRangeSettings.maxReservationsPerSlot || 1
  );
  const [activeTab, setActiveTab] = useState<'time' | 'customers'>('time');

  useEffect(() => {
    setStartHour(timeRangeSettings.startHour);
    setEndHour(timeRangeSettings.endHour);
    setMaxReservationsPerSlot(timeRangeSettings.maxReservationsPerSlot || 1);
  }, [timeRangeSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
      showNotification(t('hoursValidation'), 'error');
      return;
    }

    if (startHour >= endHour) {
      showNotification(t('startBeforeEnd'), 'error');
      return;
    }

    if (maxReservationsPerSlot < 1) {
      showNotification(t('minReservations'), 'error');
      return;
    }

    updateTimeRangeSettings({
      startHour,
      endHour,
      maxReservationsPerSlot
    });
    showNotification(t('settingsSaved'), 'success');
  };

  const handleReset = () => {
    const defaultSettings = { startHour: 8, endHour: 20, maxReservationsPerSlot: 1 };
    setStartHour(defaultSettings.startHour);
    setEndHour(defaultSettings.endHour);
    setMaxReservationsPerSlot(defaultSettings.maxReservationsPerSlot);
    updateTimeRangeSettings(defaultSettings);
    showNotification(t('settingsReset'), 'success');
  };

  return (
    <div className="trainer-settings">
      <div className="settings-container">
        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === 'time' ? 'active' : ''}`}
            onClick={() => setActiveTab('time')}
          >
            {t('timeRangeSettings')}
          </button>
          <button
            className={`tab-button ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            {t('manageCustomers')}
          </button>
        </div>

        {activeTab === 'time' ? (
          <>
            <h2>{t('timeRangeSettings')}</h2>
            <p className="settings-description">
              {t('configureTimeRange')}
            </p>

            <form onSubmit={handleSubmit} className="settings-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startHour">{t('startHour')} *</label>
                  <input
                    type="number"
                    id="startHour"
                    min="0"
                    max="23"
                    value={startHour}
                    onChange={(e) => setStartHour(parseInt(e.target.value) || 0)}
                    required
                  />
                  <span className="time-display">{String(startHour).padStart(2, '0')}:00</span>
                </div>

                <div className="form-group">
                  <label htmlFor="endHour">{t('endHour')} *</label>
                  <input
                    type="number"
                    id="endHour"
                    min="0"
                    max="23"
                    value={endHour}
                    onChange={(e) => setEndHour(parseInt(e.target.value) || 0)}
                    required
                  />
                  <span className="time-display">{String(endHour).padStart(2, '0')}:00</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="maxReservations">{t('maxReservationsPerSlot')} *</label>
                <input
                  type="number"
                  id="maxReservations"
                  min="1"
                  value={maxReservationsPerSlot}
                  onChange={(e) => setMaxReservationsPerSlot(parseInt(e.target.value) || 1)}
                  required
                />
                <span className="info-text">
                  {t('maxReservationsDescription')}
                </span>
              </div>

              <div className="settings-info">
                <p>
                  <strong>{t('currentRange')}:</strong> {String(startHour).padStart(2, '0')}:00 - {String(endHour).padStart(2, '0')}:00
                </p>
                <p className="info-note">
                  {t('timeRangeNote')}
                </p>
                <p className="info-note">
                  {t('maxReservationsNote')} {maxReservationsPerSlot} {maxReservationsPerSlot === 1 ? t('reservation') : t('reservations')}.
                </p>
              </div>

              <div className="settings-buttons">
                <button type="button" className="reset-button" onClick={handleReset}>
                  {t('resetToDefault')}
                </button>
                <button type="submit" className="save-button">
                  {t('saveSettings')}
                </button>
              </div>
            </form>
          </>
        ) : (
          <CustomerManagement />
        )}
      </div>
    </div>
  );
};

export default TrainerSettings;

