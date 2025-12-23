import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Notification.css';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 3000 
}) => {
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`notification notification-${type}`} onClick={onClose}>
      <div className="notification-content">
        <span className="notification-icon">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'info' && 'ℹ'}
        </span>
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={onClose} aria-label={t('close')}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;

