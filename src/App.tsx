import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import LandingPage from './components/LandingPage';
import Calendar from './components/Calendar';
import CustomerSelection from './components/CustomerSelection';
import SettingsButton from './components/SettingsButton';
import LanguageToggle from './components/LanguageToggle';
import logo from './assets/logo.png';
import './App.css';
import './components/Notification.css';

const AppContent: React.FC = () => {
  const { userRole, currentCustomer } = useApp();

  if (!userRole) {
    return <LandingPage />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-main">
          <h1>Mobrick Gym Planner</h1>
          <img src={logo} className="app-logo" alt="Mobrick Logo" />
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

