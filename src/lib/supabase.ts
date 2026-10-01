import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qfaofflaxxzfhovmwwtd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QXSAs3wEFOFlKQaIGzUUvA_1kP-2WAN';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.includes('supabase.co')
);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
