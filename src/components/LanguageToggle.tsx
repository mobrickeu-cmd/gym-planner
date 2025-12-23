import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ro' ? 'en' : 'ro');
  };

  return (
    <button
      className="language-toggle-button"
      onClick={toggleLanguage}
      aria-label="Toggle Language"
    >
      {language === 'ro' ? '🇷🇴 RO' : '🇬🇧 EN'}
    </button>
  );
};

export default LanguageToggle;

