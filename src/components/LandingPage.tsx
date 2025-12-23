import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const { setUserRole } = useApp();
  const { t } = useLanguage();

  const handleRoleSelect = (role: 'trainer' | 'customer') => {
    setUserRole(role);
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1 className="landing-title">{t('appTitle')}</h1>
        <p className="landing-subtitle">{t('appSubtitle')}</p>
        <div className="role-buttons">
          <button
            className="role-button trainer-button"
            onClick={() => handleRoleSelect('trainer')}
          >
            <span className="role-icon">💪</span>
            <span className="role-text">{t('gymTrainer')}</span>
          </button>
          <button
            className="role-button customer-button"
            onClick={() => handleRoleSelect('customer')}
          >
            <span className="role-icon">👤</span>
            <span className="role-text">{t('customer')}</span>
          </button>
        </div>
        <p className="landing-note">{t('selectRole')}</p>
      </div>
    </div>
  );
};

export default LandingPage;

