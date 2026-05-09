"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole } from "@/app/actions/admin";

const roles = [
  { value: 'USER', label: 'User' },
  { value: 'ARTIST', label: 'Artist' },
  { value: 'ORGANIZER', label: 'Organizer' },
  { value: 'STORE_OWNER', label: 'Store Owner' },
  { value: 'ADMIN', label: 'Admin' },
];

const roleColors: Record<string, string> = {
  USER: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-600',
  ARTIST: 'bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400 border-brand-300 dark:border-brand-700',
  ORGANIZER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700',
  STORE_OWNER: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-700',
  ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700',
};

export function UserRoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [role, setRole] = useState(currentRole);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleRoleChange = async (newRole: string) => {
    if (newRole === role) return;
    
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        setRole(newRole);
        router.refresh();
      } else {
        alert(result.message || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Update role error:', error);
      alert('Failed to update user role');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={role}
      onChange={(e) => handleRoleChange(e.target.value)}
      disabled={isUpdating}
      className={`px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 ${roleColors[role] || roleColors.USER}`}
    >
      {roles.map((r) => (
        <option key={r.value} value={r.value}>
          {r.label}
        </option>
      ))}
    </select>
  );
}
