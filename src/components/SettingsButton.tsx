import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import TrainerSettings from './TrainerSettings';
import './SettingsButton.css';

const SettingsButton: React.FC = () => {
  const { userRole } = useApp();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (userRole !== 'trainer') {
    return null;
  }

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
              <TrainerSettings />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsButton;

