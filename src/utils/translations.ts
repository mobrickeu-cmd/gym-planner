export type Language = 'ro' | 'en';

export interface Translations {
  // Landing Page
  appTitle: string;
  appSubtitle: string;
  gymTrainer: string;
  customer: string;
  selectRole: string;

  // App Header
  logout: string;
  sessions: string;

  // Calendar
  previous: string;
  next: string;
  selectAnyMonth: string;
  calendar: string;
  current: string;
  bookings: string;
  booking: string;
  yourBooking: string;
  availableSlots: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;

  // Customer Setup
  customerSetup: string;
  updateCustomerInfo: string;
  name: string;
  age: string;
  weight: string;
  weightUnit: string;
  numberOfSessions: string;
  premiumCustomer: string;
  createCustomer: string;
  update: string;
  currentCustomer: string;
  remainingSessions: string;
  premium: string;
  yes: string;
  no: string;
  fillAllFields: string;
  manageCustomers: string;
  customerList: string;
  deleteCustomer: string;
  confirmDelete: string;
  selectCustomer: string;
  noCustomers: string;
  add: string;
  save: string;

  // Time Slot Modal
  selectTimeSlot: string;
  remainingSessionsLabel: string;
  cannotMakeReservations: string;
  checkSessionCount: string;
  selectTimeSlotAlert: string;
  slotFull: string;
  slotFullMessage: string;
  noSessionsRemaining: string;
  setupProfileFirst: string;
  confirmReservation: string;
  cancel: string;
  description: string;
  descriptionPlaceholder: string;
  reservationConfirmed: string;
  at: string;
  existingReservations: string;
  noDescription: string;

  // Reservation List
  reservationsFor: string;
  noReservations: string;
  created: string;
  close: string;

  // Settings
  settings: string;
  timeRangeSettings: string;
  configureTimeRange: string;
  startHour: string;
  endHour: string;
  maxReservationsPerSlot: string;
  maxReservationsDescription: string;
  currentRange: string;
  timeRangeNote: string;
  maxReservationsNote: string;
  resetToDefault: string;
  saveSettings: string;
  settingsSaved: string;
  settingsReset: string;
  hoursValidation: string;
  startBeforeEnd: string;
  minReservations: string;

  // Common
  reservations: string;
  reservation: string;
  full: string;
}

export const translations: Record<Language, Translations> = {
  ro: {
    appTitle: 'Planificator Săli',
    appSubtitle: 'Sistem de Programare Programări',
    gymTrainer: 'Antrenor',
    customer: 'Client',
    selectRole: 'Selectați un rol pentru a continua',
    logout: 'Deconectare',
    sessions: 'sesiuni',
    previous: 'Anterior',
    next: 'Următor',
    selectAnyMonth: 'Selectează Orice Lună',
    calendar: 'Calendar',
    current: 'Curent',
    bookings: 'rezervări',
    booking: 'rezervare',
    yourBooking: 'rezervarea ta',
    availableSlots: 'liber',
    monday: 'Luni',
    tuesday: 'Marți',
    wednesday: 'Miercuri',
    thursday: 'Joi',
    friday: 'Vineri',
    saturday: 'Sâmbătă',
    sunday: 'Duminică',
    customerSetup: 'Configurare Client',
    updateCustomerInfo: 'Actualizare Informații Client',
    name: 'Nume',
    age: 'Vârstă',
    weight: 'Greutate',
    weightUnit: 'kg',
    numberOfSessions: 'Număr de Sesiuni',
    premiumCustomer: 'Client Premium',
    createCustomer: 'Creează Client',
    update: 'Actualizează',
    currentCustomer: 'Client Curent',
    remainingSessions: 'Sesiuni Rămase',
    premium: 'Premium',
    yes: 'Da',
    no: 'Nu',
    fillAllFields: 'Vă rugăm să completați toate câmpurile obligatorii',
    manageCustomers: 'Gestionare Clienți',
    customerList: 'Listă Clienți',
    deleteCustomer: 'Șterge Client',
    confirmDelete: 'Sigur doriți să ștergeți acest client?',
    selectCustomer: 'Selectează Client',
    noCustomers: 'Nu există clienți creați.',
    add: 'Adaugă',
    save: 'Salvează',
    selectTimeSlot: 'Selectează Interval Orar',
    remainingSessionsLabel: 'Sesiuni Rămase',
    cannotMakeReservations: 'Nu puteți face rezervări. Vă rugăm să verificați numărul de sesiuni.',
    checkSessionCount: 'Vă rugăm să verificați numărul de sesiuni.',
    selectTimeSlotAlert: 'Vă rugăm să selectați un interval orar',
    slotFull: 'Acest interval orar este deja plin',
    slotFullMessage: 'rezervări).',
    noSessionsRemaining: 'Nu aveți sesiuni rămase',
    setupProfileFirst: 'Vă rugăm să configurați mai întâi profilul de client',
    confirmReservation: 'Confirmă Rezervarea',
    cancel: 'Anulează',
    description: 'Descriere',
    descriptionPlaceholder: 'Introduceți o descriere pentru rezervare...',
    reservationConfirmed: 'Rezervare confirmată pentru',
    at: 'la',
    existingReservations: 'Rezervări Existente',
    noDescription: 'fără descriere',
    reservationsFor: 'Rezervări pentru',
    noReservations: 'Nu există rezervări pentru această dată.',
    created: 'Creat',
    close: 'Închide',
    settings: 'Setări',
    timeRangeSettings: 'Setări Interval Orar',
    configureTimeRange: 'Configurați intervalul orar disponibil și limita de rezervări pentru fiecare interval orar.',
    startHour: 'Ora de Început',
    endHour: 'Ora de Sfârșit',
    maxReservationsPerSlot: 'Număr Maxim de Rezervări per Interval',
    maxReservationsDescription: 'Numărul maxim de clienți care pot rezerva același interval orar',
    currentRange: 'Interval actual',
    timeRangeNote: 'Clienții vor putea selecta doar intervalele orare din acest interval.',
    maxReservationsNote: 'Fiecare interval orar poate avea maximum',
    resetToDefault: 'Resetează la Implicit',
    saveSettings: 'Salvează Setările',
    settingsSaved: 'Setările au fost salvate cu succes!',
    settingsReset: 'Setările au fost resetate la valorile implicite',
    hoursValidation: 'Orele trebuie să fie între 0 și 23',
    startBeforeEnd: 'Ora de început trebuie să fie înainte de ora de sfârșit',
    minReservations: 'Numărul maxim de rezervări per interval trebuie să fie cel puțin 1',
    reservations: 'rezervări',
    reservation: 'rezervare',
    full: 'Complet',
  },
  en: {
    appTitle: 'Gym Planner',
    appSubtitle: 'Appointment Scheduling System',
    gymTrainer: 'Gym Trainer',
    customer: 'Customer',
    selectRole: 'Select a role to continue',
    logout: 'Logout',
    sessions: 'sessions',
    previous: 'Previous',
    next: 'Next',
    selectAnyMonth: 'Select Any Month',
    calendar: 'Calendar',
    current: 'Current',
    bookings: 'bookings',
    booking: 'booking',
    yourBooking: 'your booking',
    availableSlots: 'available',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    customerSetup: 'Customer Setup',
    updateCustomerInfo: 'Update Customer Info',
    name: 'Name',
    age: 'Age',
    weight: 'Weight',
    weightUnit: 'kg',
    numberOfSessions: 'Number of Sessions',
    premiumCustomer: 'Premium Customer',
    createCustomer: 'Create Customer',
    update: 'Update',
    currentCustomer: 'Current Customer',
    remainingSessions: 'Remaining Sessions',
    premium: 'Premium',
    yes: 'Yes',
    no: 'No',
    fillAllFields: 'Please fill in all required fields',
    manageCustomers: 'Manage Customers',
    customerList: 'Customer List',
    deleteCustomer: 'Delete Customer',
    confirmDelete: 'Are you sure you want to delete this customer?',
    selectCustomer: 'Select Customer',
    noCustomers: 'No customers created yet.',
    add: 'Add',
    save: 'Save',
    selectTimeSlot: 'Select Time Slot',
    remainingSessionsLabel: 'Remaining Sessions',
    cannotMakeReservations: 'You cannot make reservations. Please check your session count.',
    checkSessionCount: 'Please check your session count.',
    selectTimeSlotAlert: 'Please select a time slot',
    slotFull: 'This time slot is already full',
    slotFullMessage: 'reservations).',
    noSessionsRemaining: 'You have no remaining sessions',
    setupProfileFirst: 'Please set up your customer profile first',
    confirmReservation: 'Confirm Reservation',
    cancel: 'Cancel',
    description: 'Description',
    descriptionPlaceholder: 'Enter a description for the reservation...',
    reservationConfirmed: 'Reservation confirmed for',
    at: 'at',
    existingReservations: 'Existing Reservations',
    noDescription: 'no description',
    reservationsFor: 'Reservations for',
    noReservations: 'No reservations for this date.',
    created: 'Created',
    close: 'Close',
    settings: 'Settings',
    timeRangeSettings: 'Time Range Settings',
    configureTimeRange: 'Configure the available time range and reservation limit for each time slot.',
    startHour: 'Start Hour',
    endHour: 'End Hour',
    maxReservationsPerSlot: 'Max Reservations per Slot',
    maxReservationsDescription: 'Maximum number of customers who can book the same time slot',
    currentRange: 'Current range',
    timeRangeNote: 'Customers will only be able to select time slots within this range.',
    maxReservationsNote: 'Each time slot can have a maximum of',
    resetToDefault: 'Reset to Default',
    saveSettings: 'Save Settings',
    settingsSaved: 'Settings saved successfully!',
    settingsReset: 'Settings have been reset to default values',
    hoursValidation: 'Hours must be between 0 and 23',
    startBeforeEnd: 'Start hour must be before end hour',
    minReservations: 'Maximum reservations per slot must be at least 1',
    reservations: 'reservations',
    reservation: 'reservation',
    full: 'Full',
  },
};

export const getTranslation = (lang: Language, key: keyof Translations): string => {
  return translations[lang][key];
};

