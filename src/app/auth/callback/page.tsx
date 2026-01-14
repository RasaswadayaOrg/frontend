"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { handleGoogleAuth } from "@/app/actions/auth";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get session from URL hash (Supabase OAuth returns tokens in URL)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          router.push("/auth/login?error=auth_failed");
          return;
        }

        if (session) {
          // Sync with backend
          const result = await handleGoogleAuth(
            session.access_token,
            session.refresh_token || ""
          );

          if (result.success) {
            // Store user in localStorage for AuthContext
            const user = {
              id: result.user.id,
              name: result.user.fullName || result.user.email,
              email: result.user.email,
              avatarUrl: result.user.avatarUrl,
              role: result.user.role,
            };
            localStorage.setItem("rasas_user", JSON.stringify(user));
            
            // Check if user is new (no city set = hasn't completed preferences)
            // If new user, redirect to complete signup preferences
            if (!result.user.city) {
              router.push("/auth/complete-profile");
            } else {
              router.push("/dashboard");
            }
          } else {
            router.push("/auth/login?error=sync_failed");
          }
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Callback handling error:", error);
        router.push("/auth/login?error=unexpected");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin h-12 w-12 border-4 border-violet-200 border-t-violet-600 rounded-full mx-auto" />
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}
