import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useLanguage } from './LanguageContext';

export type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: NotificationType = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
            style={{ top: `${20 + index * 80}px` }}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

const NotificationItem: React.FC<{
  notification: Notification;
  onClose: () => void;
  style?: React.CSSProperties;
}> = ({ notification, onClose, style }) => {
  const { t } = useLanguage();

  return (
    <div
      className={`notification notification-${notification.type}`}
      onClick={onClose}
      style={style}
    >
      <div className="notification-content">
        <span className="notification-icon">
          {notification.type === 'success' && '✓'}
          {notification.type === 'error' && '✕'}
          {notification.type === 'info' && 'ℹ'}
        </span>
        <span className="notification-message">{notification.message}</span>
        <button
          className="notification-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label={t('close')}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
