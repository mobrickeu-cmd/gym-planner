import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import './CustomerSelection.css';

const CustomerSelection: React.FC = () => {
    const { customers, setCurrentCustomer, currentCustomer } = useApp();
    const { t } = useLanguage();

    if (currentCustomer) {
        return null;
    }

    return (
        <div className="customer-selection">
            <div className="selection-container">
                <h2>{t('selectCustomer')}</h2>
                {customers.length === 0 ? (
                    <p className="no-customers-notice">{t('noCustomers')}</p>
                ) : (
                    <div className="customer-grid">
                        {customers.map((customer) => (
                            <button
                                key={customer.id}
                                className="customer-select-card"
                                onClick={() => setCurrentCustomer(customer)}
                            >
                                <div className="customer-avatar">
                                    {customer.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="customer-info-selection">
                                    <span className="customer-name">{customer.name}</span>
                                    <span className="customer-sessions-count">
                                        {customer.sessions} {t('sessions')}
                                    </span>
                                </div>
                                {customer.premium && <span className="premium-tag">⭐</span>}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerSelection;
