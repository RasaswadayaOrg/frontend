"use client";

import { AuthFlow } from "./AuthFlow";

interface AuthViewProps {
  isModal?: boolean;
  onClose?: () => void;
}

export function AuthView({ isModal = false, onClose }: AuthViewProps) {
  return (
    <AuthFlow
      defaultView="signup"
      isModal={isModal}
      onClose={onClose}
      onComplete={onClose}
      showOptionsFirst={false}
    />
  );
}