"use client";

import { useRouter } from "next/navigation";
import { SignupFlowPreferences } from "@/components/SignupFlowPreferences";

export default function CompleteProfilePage() {
  const router = useRouter();
  const handleComplete = () => {
    const returnUrl = typeof window !== "undefined" ? sessionStorage.getItem("rasas_return_url") : null;
    if (returnUrl) {
      sessionStorage.removeItem("rasas_return_url");
      router.push(returnUrl);
    } else {
      router.push("/");
    }
  };
  return <SignupFlowPreferences onComplete={handleComplete} />;
}
