export type UserRole = 'trainer' | 'customer';

export interface Customer {
  id: string;
  name: string;
  age: number;
  weight: number;
  premium: boolean;
  sessions: number;
}

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  date: string; // YYYY-MM-DD format
  timeSlot: string; // HH:00 format
  description: string;
  createdAt: string;
}

export type Language = 'ro' | 'en';

export interface CalendarDate {
  year: number;
  month: number; // 0-11
  day: number;
}

export interface TimeRangeSettings {
  startHour: number; // 0-23
  endHour: number; // 0-23
  maxReservationsPerSlot: number; // Maximum reservations allowed per time slot
}

