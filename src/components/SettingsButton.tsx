import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import TrainerSettings from './TrainerSettings';
import './SettingsButton.css';

const SettingsButton: React.FC = () => {
  const { userRole, signOut } = useApp();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (!userRole) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="settings-cog-button"
        onClick={() => setIsOpen(true)}
        aria-label={t('settings')}
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="settings-overlay" onClick={() => setIsOpen(false)}>
          <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
            <div className="settings-panel-header">
              <h2>{t('settings')}</h2>
              <button
                className="settings-close-button"
                onClick={() => setIsOpen(false)}
                aria-label={t('close')}
              >
                ×
              </button>
            </div>
            <div className="settings-panel-content">
              {userRole === 'trainer' ? (
                <TrainerSettings />
              ) : (
                <div className="customer-settings-simple">
                  <p className="settings-instruction">Mobrick Gym Planner Settings</p>
                </div>
              )}

              <div className="settings-footer-actions">
                <button className="logout-button full-width" onClick={handleLogout}>
                  {t('logout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsButton;

