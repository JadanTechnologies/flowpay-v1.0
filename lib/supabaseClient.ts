
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your actual Supabase Project URL and Public Anon Key.
// You can find these in your Supabase project settings under 'API'.
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-public-anon-key';

export const isSupabaseConfigured = !(supabaseUrl.includes('your-project-id') || supabaseAnonKey.includes('your-public-anon-key'));

if (!isSupabaseConfigured) {
  // Using a console warning is less intrusive for development.
  console.warn(
    "Supabase credentials are not set correctly. The application is running in 'demo mode' with mock data. Please update `lib/supabaseClient.ts` with your project's URL and anon key to connect to a real backend."
  );
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);