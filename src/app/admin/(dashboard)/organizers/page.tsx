import { getUsers, getUsersCount } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Search, Users, MapPin, Mail, Phone, Calendar } from "lucide-react";
import { DeleteUserButton } from "@/app/admin/(dashboard)/users/DeleteUserButton";
import { formatDistanceToNow } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function AdminOrganizersPage() {
  const users = await getUsers(50, 1, undefined, 'ORGANIZER');
  const totalCount = await getUsersCount(undefined, 'ORGANIZER');

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organizers Management</h1>
          <p className="text-sm text-slate-500">{totalCount} total organizers in the system.</p>
        </div>
        <Link href="/admin/organizers/new" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add Organizer
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search organizers..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
         
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Organizer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-brand-600 text-white font-bold text-sm flex-shrink-0">
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
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Phone className="w-3 h-3" />
                                <span>{user.phone}</span>
                            </div>
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
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                     <div className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/organizers/${user.id}/edit`} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteUserButton userId={user.id} userName={user.fullName || user.email} />
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No organizers found.
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
