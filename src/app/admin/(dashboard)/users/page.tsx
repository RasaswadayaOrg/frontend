import { getUsers, getUsersCount } from "@/lib/db";
import Link from "next/link";
import { Search, Mail, MapPin, Shield, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UserRoleSelect } from "@/app/admin/(dashboard)/users/UserRoleSelect";
import { DeleteUserButton } from "@/app/admin/(dashboard)/users/DeleteUserButton";
import { UsersTableClient } from "@/app/admin/(dashboard)/users/UsersTableClient";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await getUsers(50, 1);
  const totalCount = await getUsersCount();

  // Sort users: pending applications first, then by creation date
  const sortedUsers = [...users].sort((a: any, b: any) => {
    // Users with pending applications come first
    const aPending = a.hasPendingApplication ? 1 : 0;
    const bPending = b.hasPendingApplication ? 1 : 0;
    
    if (aPending !== bPending) {
      return bPending - aPending; // Pending users first
    }
    
    // If both have same pending status, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Calculate pending applications counts
  const pendingArtistCount = users.filter((u: any) => 
    u.pendingApplications?.some((app: any) => app.role === 'ARTIST')
  ).length;
  
  const pendingOrganizerCount = users.filter((u: any) => 
    u.pendingApplications?.some((app: any) => app.role === 'ORGANIZER')
  ).length;

  const roleColors: Record<string, string> = {
    USER: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
    ARTIST: 'bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400',
    ORGANIZER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    STORE_OWNER: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const formatDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users Management</h1>
          <p className="text-sm text-slate-500">{totalCount} total users in the system.</p>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        {['USER', 'ARTIST', 'ORGANIZER', 'STORE_OWNER', 'ADMIN'].map((role) => {
          const count = users.filter((u: any) => u.role === role).length;
          return (
            <div key={role} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 ${
                  role === 'ADMIN' ? 'text-red-500' :
                  role === 'ARTIST' ? 'text-brand-500' :
                  role === 'ORGANIZER' ? 'text-blue-500' :
                  role === 'STORE_OWNER' ? 'text-amber-500' : 'text-slate-500'
                }`} />
                <span className="text-xs font-medium text-slate-500">{role.replace('_', ' ')}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{count}</p>
            </div>
          );
        })}
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-300 dark:border-orange-700 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-medium text-orange-700 dark:text-orange-400">PENDING ARTIST</span>
          </div>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-300 mt-1">{pendingArtistCount}</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 border border-cyan-300 dark:border-cyan-700 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">PENDING ORGANIZER</span>
          </div>
          <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-300 mt-1">{pendingOrganizerCount}</p>
        </div>
      </div>

      <UsersTableClient users={sortedUsers} />
    </div>
  );
}
