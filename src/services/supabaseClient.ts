import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('App: Supabase URL or Anon Key is missing from environment variables!');
} else {
    console.log('App: Supabase client initialized with URL:', supabaseUrl.substring(0, 15) + '...');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
