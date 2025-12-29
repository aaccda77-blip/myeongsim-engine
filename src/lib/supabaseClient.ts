import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// [Build Fix] Ensure URL is valid (starts with http/https) to prevent build crash
const validUrl = supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('⚠️ Supabase URL missing. Using placeholder for build.');
}

export const supabase = createClient(validUrl, supabaseKey);
