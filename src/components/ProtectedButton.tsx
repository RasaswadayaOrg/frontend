"use client";

import { useAuth } from "@/context/AuthContext";
import React from "react";

interface ProtectedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onProtectedClick?: () => void;
}

export function ProtectedButton({ children, onClick, onProtectedClick, ...props }: ProtectedButtonProps) {
  const { user, openAuthModal } = useAuth();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      openAuthModal();
      return;
    }
    
    if (onClick) {
      onClick(e);
    } else if (onProtectedClick) {
      onProtectedClick();
    }
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
