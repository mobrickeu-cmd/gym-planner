import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import LandingPage from './components/LandingPage';
import Calendar from './components/Calendar';
import SettingsButton from './components/SettingsButton';
import LanguageToggle from './components/LanguageToggle';
import logo from './assets/logo.png';
import './App.css';
import './components/Notification.css';

const AppContent: React.FC = () => {
  const { userRole, isLoading, isAuthLoading, user, signOut, isGuest } = useApp();

  if ((isLoading || isAuthLoading) && !isGuest) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading Gym Planner...</p>
      </div>
    );
  }

  if (!userRole) {
    return <LandingPage />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-main">
          <h1>Mobrick Gym Planner</h1>
          <div className="header-right">
            {user && (
              <div className="user-info">
                {user.user_metadata.avatar_url && (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="user-avatar" />
                )}
                <span className="user-email">{user.email}</span>
                <button className="logout-button" onClick={signOut}>Sign Out</button>
              </div>
            )}
            <img src={logo} className="app-logo" alt="Mobrick Logo" />
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="calendar-section">
          <Calendar />
        </div>
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

