import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { UserRole, Customer, Reservation, TimeRangeSettings } from '../types';
import { storageService } from '../services/storage';
import { databaseService } from '../services/database';

interface AppContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  currentCustomer: Customer | null;
  setCurrentCustomer: (customer: Customer | null) => void;
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => Promise<void>;
  getReservationsByDate: (date: string) => Reservation[];
  refreshReservations: () => Promise<void>;
  timeRangeSettings: TimeRangeSettings;
  updateTimeRangeSettings: (settings: TimeRangeSettings) => Promise<void>;
  isLoading: boolean;
  isAuthLoading: boolean;
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isGuest: boolean;
  startGuestSession: () => void;
  authError: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [timeRangeSettings, setTimeRangeSettings] = useState<TimeRangeSettings>({
    startHour: 8,
    endHour: 20,
    maxReservationsPerSlot: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('gym_planner_guest_mode') === 'true');
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchData = async () => {
    console.log('App: Fetching initial data...');
    setIsLoading(true);

    if (isGuest) {
      console.log('App: In guest mode, using local storage only');
      setCustomers(storageService.getCustomers());
      setReservations(storageService.getReservations());
      setTimeRangeSettings(storageService.getTimeRangeSettings());
      setIsLoading(false);
      return;
    }

    // Safety timeout for data fetching
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('App: Data fetch timed out after 10s, using local fallback');
        setCustomers(storageService.getCustomers());
        setReservations(storageService.getReservations());
        setTimeRangeSettings(storageService.getTimeRangeSettings());
        setIsLoading(false);
      }
    }, 10000);

    try {
      const [dbCustomers, dbReservations, dbSettings] = await Promise.all([
        databaseService.getCustomers(),
        databaseService.getReservations(),
        databaseService.getTimeRangeSettings(),
      ]);

      console.log('App: Data fetched successfully');
      setCustomers(dbCustomers.length > 0 ? dbCustomers : storageService.getCustomers());
      setReservations(dbReservations.length > 0 ? dbReservations : storageService.getReservations());
      setTimeRangeSettings(dbSettings || storageService.getTimeRangeSettings());
    } catch (error) {
      console.error('App: Error fetching data:', error);
      setCustomers(storageService.getCustomers());
      setReservations(storageService.getReservations());
      setTimeRangeSettings(storageService.getTimeRangeSettings());
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const { data: { subscription } } = databaseService.onAuthStateChange(async (_event, session) => {
      console.log('App: Auth state changed:', _event);
      setIsAuthLoading(true);

      const authTimeout = setTimeout(() => {
        // If we're still loading after 15 seconds, something is likely stuck
        // We'll stop the loader to allow the LandingPage to show retry/signout buttons
        setIsAuthLoading(false);
        setAuthError('Initialization is taking longer than expected. Please check your connection or try again.');
        console.warn('App: Profile fetch timed out after 15s');
      }, 15000);

      try {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          console.log('App: User logged in, fetching profile for ID:', currentUser.id);
          // Add a per-request timeout for profile fetching
          const profilePromise = databaseService.getProfile(currentUser.id);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
          );

          const profile = await Promise.race([profilePromise, timeoutPromise]) as Customer | null;

          if (profile) {
            console.log('App: Profile found:', profile);
            setUserRole(profile.role as UserRole || 'customer');
            if (profile.role === 'customer' || !profile.role) {
              setCurrentCustomer(profile);
            }
          } else {
            console.log('App: No profile found in DB, creating default customer profile...');
            const newProfile: Partial<Customer> & { id: string } = {
              id: currentUser.id,
              email: currentUser.email || '',
              role: 'customer' as UserRole,
              name: currentUser.user_metadata.full_name || currentUser.email?.split('@')[0] || 'User',
              age: 0,
              weight: 0,
              premium: false,
              sessions: 10
            };
            await databaseService.upsertProfile(newProfile);
            setUserRole('customer');
            setCurrentCustomer(newProfile as Customer);
          }
        } else {
          console.log('App: No active session');
          setUserRole(null);
          setCurrentCustomer(null);
        }
      } catch (error) {
        console.error('App: Error in auth change handler:', error);
        setAuthError(error instanceof Error ? error.message : 'An error occurred while preparing your planner');
        // On error, we still want to stop loading so the user can see the UI (and likely a Sign Out button)
        setIsAuthLoading(false);
      } finally {
        clearTimeout(authTimeout);
        setIsAuthLoading(false);
        console.log('App: Auth loading finished');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isGuest]);

  const startGuestSession = () => {
    console.log('App: Starting guest session as trainer');
    setIsGuest(true);
    localStorage.setItem('gym_planner_guest_mode', 'true');
    setUserRole('trainer');
    setCurrentCustomer(null);
    setIsAuthLoading(false);
    setAuthError(null);
  };

  const signInWithGoogle = async () => {
    await databaseService.signInWithGoogle();
  };

  const signOut = async () => {
    if (isGuest) {
      setIsGuest(false);
      localStorage.removeItem('gym_planner_guest_mode');
    } else {
      await databaseService.signOut();
    }
    setUserRole(null);
    setCurrentCustomer(null);
    setAuthError(null);
  };

  const addCustomer = async (customer: Customer) => {
    if (isGuest) {
      storageService.addCustomer(customer);
      setCustomers(storageService.getCustomers());
      return;
    }
    try {
      await databaseService.addCustomer(customer);
    } catch (e) {
      storageService.addCustomer(customer);
    }
    const updated = await databaseService.getCustomers();
    setCustomers(updated.length > 0 ? updated : storageService.getCustomers());
  };

  const updateCustomer = async (customerId: string, updates: Partial<Customer>) => {
    if (isGuest) {
      storageService.updateCustomer(customerId, updates);
      setCustomers(storageService.getCustomers());
      return;
    }
    try {
      await databaseService.updateCustomer(customerId, updates);
    } catch (e) {
      storageService.updateCustomer(customerId, updates);
    }
    const updated = await databaseService.getCustomers();
    setCustomers(updated.length > 0 ? updated : storageService.getCustomers());
  };

  const deleteCustomer = async (customerId: string) => {
    if (isGuest) {
      storageService.deleteCustomer(customerId);
      setCustomers(storageService.getCustomers());
      return;
    }
    try {
      await databaseService.deleteCustomer(customerId);
    } catch (e) {
      storageService.deleteCustomer(customerId);
    }
    const updated = await databaseService.getCustomers();
    setCustomers(updated.length > 0 ? updated : storageService.getCustomers());

    if (currentCustomer?.id === customerId) {
      setCurrentCustomer(null);
    }
  };

  const addReservation = async (reservation: Reservation) => {
    if (isGuest) {
      storageService.addReservation(reservation);
      setReservations(storageService.getReservations());
      return;
    }
    try {
      await databaseService.addReservation(reservation);
    } catch (e) {
      storageService.addReservation(reservation);
    }
    const updated = await databaseService.getReservations();
    setReservations(updated.length > 0 ? updated : storageService.getReservations());

    // Decrease customer sessions if not a trainer
    if (userRole === 'customer' && currentCustomer) {
      const newSessions = Math.max(0, currentCustomer.sessions - 1);
      await updateCustomer(currentCustomer.id, { sessions: newSessions });
      if (currentCustomer.id === reservation.customerId) {
        setCurrentCustomer({ ...currentCustomer, sessions: newSessions });
      }
    }
  };

  const getReservationsByDate = (date: string): Reservation[] => {
    return reservations.filter((r) => r.date === date);
  };

  const refreshReservations = async () => {
    if (isGuest) {
      setReservations(storageService.getReservations());
      return;
    }
    const updated = await databaseService.getReservations();
    setReservations(updated.length > 0 ? updated : storageService.getReservations());
  };

  const updateTimeRangeSettings = async (settings: TimeRangeSettings) => {
    if (isGuest) {
      storageService.saveTimeRangeSettings(settings);
      setTimeRangeSettings(settings);
      return;
    }
    try {
      await databaseService.saveTimeRangeSettings(settings);
    } catch (e) {
      storageService.saveTimeRangeSettings(settings);
    }
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
        isLoading,
        isAuthLoading,
        user,
        signInWithGoogle,
        signOut,
        isGuest,
        startGuestSession,
        authError,
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

