import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { Customer } from '../types';
import './CustomerManagement.css';

const CustomerManagement: React.FC = () => {
    const { customers, addCustomer, updateCustomer, deleteCustomer } = useApp();
    const { t } = useLanguage();
    const { showNotification } = useNotification();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Customer>>({
        name: '',
        age: 0,
        weight: 0,
        premium: false,
        sessions: 0,
    });

    const resetForm = () => {
        setFormData({
            name: '',
            age: 0,
            weight: 0,
            premium: false,
            sessions: 0,
        });
        setEditingId(null);
    };

    const handleEdit = (customer: Customer) => {
        setEditingId(customer.id);
        setFormData(customer);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t('confirmDelete'))) {
            deleteCustomer(id);
            showNotification(t('deleteCustomer'), 'success');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            showNotification(t('fillAllFields'), 'error');
            return;
        }

        if (editingId) {
            updateCustomer(editingId, formData as Customer);
            showNotification(t('update'), 'success');
        } else {
            const newCustomer: Customer = {
                id: Date.now().toString(),
                name: formData.name,
                age: formData.age || 0,
                weight: formData.weight || 0,
                premium: formData.premium || false,
                sessions: formData.sessions || 0,
            };
            addCustomer(newCustomer);
            showNotification(t('createCustomer'), 'success');
        }
        resetForm();
    };

    return (
        <div className="customer-management">
            <div className="management-header">
                <h3>{editingId ? t('updateCustomerInfo') : t('createCustomer')}</h3>
            </div>

            <form onSubmit={handleSubmit} className="customer-form-trainer">
                <div className="form-grid">
                    <div className="form-group">
                        <label>{t('name')} *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('age')}</label>
                        <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('weight')} ({t('weightUnit')})</label>
                        <input
                            type="number"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('numberOfSessions')}</label>
                        <input
                            type="number"
                            value={formData.sessions}
                            onChange={(e) => setFormData({ ...formData, sessions: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                </div>

                <div className="form-options">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={formData.premium}
                            onChange={(e) => setFormData({ ...formData, premium: e.target.checked })}
                        />
                        {t('premiumCustomer')}
                    </label>
                </div>

                <div className="form-actions">
                    {editingId && (
                        <button type="button" className="cancel-button" onClick={resetForm}>
                            {t('cancel')}
                        </button>
                    )}
                    <button type="submit" className="submit-button">
                        {editingId ? t('save') : t('add')}
                    </button>
                </div>
            </form>

            <div className="customer-list-section">
                <h3>{t('customerList')}</h3>
                {customers.length === 0 ? (
                    <p className="no-customers">{t('noCustomers')}</p>
                ) : (
                    <div className="customer-table-wrapper">
                        <table className="customer-table">
                            <thead>
                                <tr>
                                    <th>{t('name')}</th>
                                    <th>{t('sessions')}</th>
                                    <th>{t('premium')}</th>
                                    <th>{t('actions' as any)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.name}</td>
                                        <td>{c.sessions}</td>
                                        <td>{c.premium ? '✅' : '❌'}</td>
                                        <td className="actions-cell">
                                            <button className="edit-btn" onClick={() => handleEdit(c)}>✏️</button>
                                            <button className="delete-btn" onClick={() => handleDelete(c.id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerManagement;
