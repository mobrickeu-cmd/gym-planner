import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const { user, signInWithGoogle, signOut, startGuestSession, isLoading, authError } = useApp();
  const { t } = useLanguage();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1 className="landing-title">{t('appTitle')}</h1>
        <p className="landing-subtitle">{t('appSubtitle')}</p>
        <div className="role-buttons">
          {!user ? (
            <>
              <button
                className="google-login-button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                <span>Login with Google to continue</span>
              </button>

              <button
                className="guest-experience-button"
                onClick={startGuestSession}
                disabled={isLoading}
              >
                <span className="guest-icon">🎭</span>
                <span>Guest Experience (Demo)</span>
              </button>
            </>
          ) : (
            <div className="loading-profile">
              {!authError && <div className="loader small"></div>}
              <p>{authError ? 'Initialization Failed' : 'Preparing your planner...'}</p>
              {authError && <p className="auth-error-message">{authError}</p>}
              <div className="loading-actions">
                <button
                  className="secondary-button"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
                <button
                  className="text-button"
                  onClick={signOut}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
        {!user && <p className="landing-note">An account is required to schedule appointments.</p>}
      </div>
    </div>
  );
};

export default LandingPage;

