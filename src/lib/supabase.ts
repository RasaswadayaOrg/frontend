import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_COOKIE_NAME = 'rasaswadaya-supabase-auth';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

// Browser client — @supabase/ssr stores the PKCE code verifier in cookies
// (not localStorage), so it's available to the server-side /auth/callback
// route handler. This fixes "AuthPKCECodeVerifierMissingError" in Next.js.
export const supabase = createBrowserClient(supabaseUrl || '', supabaseAnonKey || '', {
  cookieOptions: {
    name: SUPABASE_COOKIE_NAME,
    path: '/',
    sameSite: 'lax',
  },
});

export function clearSupabaseOAuthState(): void {
  if (typeof document === 'undefined') return;

  const cookieNames = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0]?.trim())
    .filter(Boolean);

  const namesToClear = new Set<string>([
    `${SUPABASE_COOKIE_NAME}-code-verifier`,
    ...cookieNames.filter((name) => name.includes('code-verifier')),
  ]);

  namesToClear.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    if (window.location.protocol === 'https:') {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax; Secure`;
    }
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
