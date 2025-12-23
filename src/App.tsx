import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import LandingPage from './components/LandingPage';
import Calendar from './components/Calendar';
import CustomerSelection from './components/CustomerSelection';
import SettingsButton from './components/SettingsButton';
import LanguageToggle from './components/LanguageToggle';
import './App.css';
import './components/Notification.css';

const AppContent: React.FC = () => {
  const { userRole, currentCustomer, setUserRole } = useApp();
  const { t } = useLanguage();

  if (!userRole) {
    return <LandingPage />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('appTitle')}</h1>
        <div className="header-info">
          <span className="role-badge">
            {userRole === 'trainer' ? `💪 ${t('gymTrainer')}` : `👤 ${t('customer')}`}
          </span>
          {currentCustomer && (
            <span className="customer-badge">
              {currentCustomer.name} - {currentCustomer.sessions} {t('sessions')}
            </span>
          )}
          <button className="logout-button" onClick={() => {
            setUserRole(null);
            window.location.reload();
          }}>
            {t('logout')}
          </button>
        </div>
      </header>

      <main className="app-main">
        {userRole === 'customer' && !currentCustomer && (
          <CustomerSelection />
        )}
        {(userRole === 'trainer' || currentCustomer) && (
          <div className="calendar-section">
            <Calendar />
          </div>
        )}
      </main>
      <SettingsButton />
      <LanguageToggle />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
};

export default App;

