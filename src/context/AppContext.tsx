import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, Customer, Reservation, TimeRangeSettings } from '../types';
import { storageService } from '../services/storage';

interface AppContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  currentCustomer: Customer | null;
  setCurrentCustomer: (customer: Customer | null) => void;
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  deleteCustomer: (customerId: string) => void;
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  getReservationsByDate: (date: string) => Reservation[];
  refreshReservations: () => void;
  timeRangeSettings: TimeRangeSettings;
  updateTimeRangeSettings: (settings: TimeRangeSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [timeRangeSettings, setTimeRangeSettings] = useState<TimeRangeSettings>(
    storageService.getTimeRangeSettings()
  );

  useEffect(() => {
    setCustomers(storageService.getCustomers());
    setReservations(storageService.getReservations());
    setTimeRangeSettings(storageService.getTimeRangeSettings());
  }, []);

  const addCustomer = (customer: Customer) => {
    storageService.addCustomer(customer);
    setCustomers(storageService.getCustomers());
  };

  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    storageService.updateCustomer(customerId, updates);
    setCustomers(storageService.getCustomers());
  };

  const deleteCustomer = (customerId: string) => {
    storageService.deleteCustomer(customerId);
    setCustomers(storageService.getCustomers());
    if (currentCustomer?.id === customerId) {
      setCurrentCustomer(null);
    }
  };

  const addReservation = (reservation: Reservation) => {
    storageService.addReservation(reservation);
    setReservations(storageService.getReservations());

    // Decrease customer sessions if not a trainer
    if (userRole === 'customer' && currentCustomer) {
      const newSessions = Math.max(0, currentCustomer.sessions - 1);
      updateCustomer(currentCustomer.id, { sessions: newSessions });
      if (currentCustomer.id === reservation.customerId) {
        setCurrentCustomer({ ...currentCustomer, sessions: newSessions });
      }
    }
  };

  const getReservationsByDate = (date: string): Reservation[] => {
    return storageService.getReservationsByDate(date);
  };

  const refreshReservations = () => {
    setReservations(storageService.getReservations());
  };

  const updateTimeRangeSettings = (settings: TimeRangeSettings) => {
    storageService.saveTimeRangeSettings(settings);
    setTimeRangeSettings(settings);
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentCustomer,
        setCurrentCustomer,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        reservations,
        addReservation,
        getReservationsByDate,
        refreshReservations,
        timeRangeSettings,
        updateTimeRangeSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

