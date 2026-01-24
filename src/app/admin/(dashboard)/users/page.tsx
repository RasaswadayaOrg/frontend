import { getUsers, getUsersCount } from "@/lib/db";
import Link from "next/link";
import { Search, Mail, MapPin, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UserRoleSelect } from "@/app/admin/(dashboard)/users/UserRoleSelect";
import { DeleteUserButton } from "@/app/admin/(dashboard)/users/DeleteUserButton";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await getUsers(50, 1);
  const totalCount = await getUsersCount();

  const roleColors: Record<string, string> = {
    USER: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
    ARTIST: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['USER', 'ARTIST', 'ORGANIZER', 'STORE_OWNER', 'ADMIN'].map((role) => {
          const count = users.filter((u: any) => u.role === role).length;
          return (
            <div key={role} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 ${
                  role === 'ADMIN' ? 'text-red-500' :
                  role === 'ARTIST' ? 'text-purple-500' :
                  role === 'ORGANIZER' ? 'text-blue-500' :
                  role === 'STORE_OWNER' ? 'text-amber-500' : 'text-slate-500'
                }`} />
                <span className="text-xs font-medium text-slate-500">{role.replace('_', ' ')}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
         
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{user.email}</span>
                      </div>
                      {user.phone && (
                        <p className="text-xs text-slate-500">{user.phone}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.city ? (
                      <div className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{user.city}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <UserRoleSelect userId={user.id} currentRole={user.role} />
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/users/${user.id}`} 
                        className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                      >
                        View
                      </Link>
                      <DeleteUserButton userId={user.id} userName={user.fullName || user.email} />
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
