import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

// Browser client — @supabase/ssr stores the PKCE code verifier in cookies
// (not localStorage), so it's available to the server-side /auth/callback
// route handler. This fixes "AuthPKCECodeVerifierMissingError" in Next.js.
export const supabase = createBrowserClient(supabaseUrl || '', supabaseAnonKey || '');

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
