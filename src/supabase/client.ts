import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (supabaseUrl === 'https://placeholder-project.supabase.co' || supabaseAnonKey === 'placeholder-key') {
    console.warn('Supabase URL or Anon Key is missing. Check your .env file or environment variables. Using placeholder values for now.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
