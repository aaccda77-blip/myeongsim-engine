import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ using ANON key for Admin client. This may fail if RLS is strict.');
}

// Create a Supabase client with the Service Role Key
// This client should ONLY be used in server-side API routes, never on the client.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
