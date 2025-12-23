import { Customer, Reservation, TimeRangeSettings } from '../types';

const CUSTOMERS_KEY = 'gym_planner_customers';
const RESERVATIONS_KEY = 'gym_planner_reservations';
const TIME_RANGE_SETTINGS_KEY = 'gym_planner_time_range_settings';

export const storageService = {
  // Customers
  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveCustomers: (customers: Customer[]): void => {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  },

  addCustomer: (customer: Customer): void => {
    const customers = storageService.getCustomers();
    customers.push(customer);
    storageService.saveCustomers(customers);
  },

  updateCustomer: (customerId: string, updates: Partial<Customer>): void => {
    const customers = storageService.getCustomers();
    const index = customers.findIndex(c => c.id === customerId);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      storageService.saveCustomers(customers);
    }
  },

  deleteCustomer: (customerId: string): void => {
    const customers = storageService.getCustomers();
    const filtered = customers.filter(c => c.id !== customerId);
    storageService.saveCustomers(filtered);
  },

  getCustomer: (customerId: string): Customer | undefined => {
    const customers = storageService.getCustomers();
    return customers.find(c => c.id === customerId);
  },

  // Reservations
  getReservations: (): Reservation[] => {
    const data = localStorage.getItem(RESERVATIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveReservations: (reservations: Reservation[]): void => {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
  },

  addReservation: (reservation: Reservation): void => {
    const reservations = storageService.getReservations();
    reservations.push(reservation);
    storageService.saveReservations(reservations);
  },

  getReservationsByDate: (date: string): Reservation[] => {
    const reservations = storageService.getReservations();
    return reservations.filter(r => r.date === date);
  },

  getReservationsByCustomer: (customerId: string): Reservation[] => {
    const reservations = storageService.getReservations();
    return reservations.filter(r => r.customerId === customerId);
  },

  deleteReservation: (reservationId: string): void => {
    const reservations = storageService.getReservations();
    const filtered = reservations.filter(r => r.id !== reservationId);
    storageService.saveReservations(filtered);
  },

  // Time Range Settings
  getTimeRangeSettings: (): TimeRangeSettings => {
    const data = localStorage.getItem(TIME_RANGE_SETTINGS_KEY);
    if (data) {
      const settings = JSON.parse(data);
      // Ensure backward compatibility - add maxReservationsPerSlot if missing
      if (settings.maxReservationsPerSlot === undefined) {
        settings.maxReservationsPerSlot = 1;
      }
      return settings;
    }
    // Default: 8 AM to 8 PM, max 1 reservation per slot
    return { startHour: 8, endHour: 20, maxReservationsPerSlot: 1 };
  },

  saveTimeRangeSettings: (settings: TimeRangeSettings): void => {
    localStorage.setItem(TIME_RANGE_SETTINGS_KEY, JSON.stringify(settings));
  },
};

