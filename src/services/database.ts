import { supabase } from './supabaseClient';
import { Customer, Reservation, TimeRangeSettings } from '../types';

export const databaseService = {
    // Customers
    getCustomers: async (): Promise<Customer[]> => {
        console.log('DB: Fetching customers...');
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('name');

        if (error) {
            console.error('DB: Error fetching customers:', error);
            return [];
        }
        console.log('DB: Fetched customers:', data?.length);
        return data as Customer[];
    },

    addCustomer: async (customer: Customer): Promise<void> => {
        const { error } = await supabase
            .from('customers')
            .insert([customer]);

        if (error) {
            console.error('Error adding customer:', error);
            throw error;
        }
    },

    updateCustomer: async (customerId: string, updates: Partial<Customer>): Promise<void> => {
        const { error } = await supabase
            .from('customers')
            .update(updates)
            .eq('id', customerId);

        if (error) {
            console.error('Error updating customer:', error);
            throw error;
        }
    },

    deleteCustomer: async (customerId: string): Promise<void> => {
        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', customerId);

        if (error) {
            console.error('Error deleting customer:', error);
            throw error;
        }
    },

    // Profiles (using the same 'customers' table for simplicity)
    getProfile: async (userId: string): Promise<Customer | null> => {
        console.log('DB: Fetching profile for:', userId);
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('DB: No profile found (PGRST116)');
                return null;
            }
            console.error('DB: Error fetching profile:', error);
            return null;
        }
        console.log('DB: Profile fetched:', data);
        return data as Customer | null;
    },

    upsertProfile: async (profile: Partial<Customer> & { id: string }): Promise<void> => {
        const { error } = await supabase
            .from('customers')
            .upsert(profile, { onConflict: 'id' });

        if (error) {
            console.error('Error upserting profile:', error);
            throw error;
        }
    },

    // Reservations
    getReservations: async (): Promise<Reservation[]> => {
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .order('date')
            .order('time_slot');

        if (error) {
            console.error('Error fetching reservations:', error);
            return [];
        }
        return (data || []).map(r => ({
            ...r,
            customerId: r.customer_id,
            customerName: r.customer_name,
            timeSlot: r.time_slot,
            createdAt: r.created_at
        })) as unknown as Reservation[];
    },

    addReservation: async (reservation: Reservation): Promise<void> => {
        const dbReservation = {
            id: reservation.id,
            customer_id: reservation.customerId,
            customer_name: reservation.customerName,
            date: reservation.date,
            time_slot: reservation.timeSlot,
            description: reservation.description,
            created_at: reservation.createdAt
        };

        const { error } = await supabase
            .from('reservations')
            .insert([dbReservation]);

        if (error) {
            console.error('Error adding reservation:', error);
            throw error;
        }
    },

    deleteReservation: async (reservationId: string): Promise<void> => {
        const { error } = await supabase
            .from('reservations')
            .delete()
            .eq('id', reservationId);

        if (error) {
            console.error('Error deleting reservation:', error);
            throw error;
        }
    },

    // Settings
    getTimeRangeSettings: async (): Promise<TimeRangeSettings> => {
        const { data, error } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'time_range')
            .single();

        if (error) {
            console.error('Error fetching settings:', error);
            return { startHour: 8, endHour: 20, maxReservationsPerSlot: 1 };
        }
        return data.value as TimeRangeSettings;
    },

    saveTimeRangeSettings: async (settings: TimeRangeSettings): Promise<void> => {
        const { error } = await supabase
            .from('settings')
            .upsert({ key: 'time_range', value: settings }, { onConflict: 'key' });

        if (error) {
            console.error('Error saving settings:', error);
            throw error;
        }
    },

    // Authentication
    signInWithGoogle: async (): Promise<void> => {
        // Ensure redirect includes the subpath if hosted on GitHub Pages
        const redirectTo = window.location.origin + (import.meta.env.BASE_URL || '/');
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectTo,
            },
        });

        if (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    },

    signOut: async (): Promise<void> => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    },

    getUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    onAuthStateChange: (callback: (event: any, session: any) => void) => {
        return supabase.auth.onAuthStateChange(callback);
    }
};
