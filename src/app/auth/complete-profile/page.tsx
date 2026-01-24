"use client";

import { useRouter } from "next/navigation";
import { SignupFlowPreferences } from "@/components/SignupFlowPreferences";

export default function CompleteProfilePage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <SignupFlowPreferences onComplete={handleComplete} />
      </div>
    </div>
  );
}
