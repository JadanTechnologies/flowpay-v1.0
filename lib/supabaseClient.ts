import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

// Fallback to placeholder values if environment variables are not set.
// In a real environment, these should be securely managed.
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn("Supabase URL and anon key are not set. Please update them in environment variables for the application to function correctly.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)