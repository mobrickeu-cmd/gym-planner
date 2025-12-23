import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { Customer } from '../types';
import './CustomerSetup.css';

const CustomerSetup: React.FC = () => {
  const { currentCustomer, setCurrentCustomer, addCustomer, updateCustomer } = useApp();
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: currentCustomer?.name || '',
    age: currentCustomer?.age || 0,
    weight: currentCustomer?.weight || 0,
    premium: currentCustomer?.premium || false,
    sessions: currentCustomer?.sessions || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.age === undefined || formData.weight === undefined || formData.sessions === undefined) {
      showNotification(t('fillAllFields'), 'error');
      return;
    }

    if (currentCustomer) {
      updateCustomer(currentCustomer.id, formData as Customer);
      setCurrentCustomer({ ...currentCustomer, ...formData } as Customer);
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: formData.name!,
        age: formData.age!,
        weight: formData.weight!,
        premium: formData.premium || false,
        sessions: formData.sessions!,
      };
      addCustomer(newCustomer);
      setCurrentCustomer(newCustomer);
    }
  };

  return (
    <div className="customer-setup">
      <div className="setup-container">
        <h2>{currentCustomer ? t('updateCustomerInfo') : t('customerSetup')}</h2>
        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-group">
            <label htmlFor="name">{t('name')} *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">{t('age')} *</label>
            <input
              type="number"
              id="age"
              step="0.1"
              value={formData.age === 0 ? '' : formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseFloat(e.target.value) || 0 })}
              onFocus={(e) => e.target.select()}
              placeholder="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">{t('weight')} ({t('weightUnit')}) *</label>
            <input
              type="number"
              id="weight"
              step="0.1"
              value={formData.weight === 0 ? '' : formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
              onFocus={(e) => e.target.select()}
              placeholder="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sessions">{t('numberOfSessions')} *</label>
            <input
              type="number"
              id="sessions"
              step="0.1"
              value={formData.sessions === 0 ? '' : formData.sessions}
              onChange={(e) => setFormData({ ...formData, sessions: parseFloat(e.target.value) || 0 })}
              onFocus={(e) => e.target.select()}
              placeholder="0"
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label htmlFor="premium">
              <input
                type="checkbox"
                id="premium"
                checked={formData.premium}
                onChange={(e) => setFormData({ ...formData, premium: e.target.checked })}
              />
              {t('premiumCustomer')}
            </label>
          </div>

          <button type="submit" className="submit-button">
            {currentCustomer ? t('update') : t('createCustomer')}
          </button>
        </form>

        {currentCustomer && (
          <div className="customer-info">
            <h3>{t('currentCustomer')}</h3>
            <p><strong>{t('name')}:</strong> {currentCustomer.name}</p>
            <p><strong>{t('remainingSessions')}:</strong> {currentCustomer.sessions}</p>
            <p><strong>{t('premium')}:</strong> {currentCustomer.premium ? t('yes') : t('no')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSetup;

