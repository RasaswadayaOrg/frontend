'use client';

import { useState } from "react";
import { Search, Mail, MapPin, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UserRoleSelect } from "./UserRoleSelect";
import { DeleteUserButton } from "./DeleteUserButton";
import UserDetailsModal from "@/components/admin/UserDetailsModal";

interface UsersTableClientProps {
  users: any[];
}

export function UsersTableClient({ users }: UsersTableClientProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {users.map((user: any) => (
                <tr 
                  key={user.id} 
                  className={`transition-all ${
                    user.hasPendingApplication 
                      ? 'bg-gradient-to-r from-orange-50 via-orange-50/50 to-transparent dark:from-orange-900/20 dark:via-orange-900/10 dark:to-transparent border-l-4 border-l-orange-500 hover:from-orange-100 hover:via-orange-50 dark:hover:from-orange-900/30 dark:hover:via-orange-900/20' 
                      : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                        user.hasPendingApplication 
                          ? 'bg-gradient-to-br from-orange-500 to-red-600 ring-2 ring-orange-300 dark:ring-orange-700' 
                          : 'bg-gradient-to-br from-blue-500 to-brand-600'
                      }`}>
                        {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900 dark:text-white truncate">
                            {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}
                          </p>
                          {user.hasPendingApplication && (
                            <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-bold bg-orange-500 text-white rounded-full uppercase tracking-wider">
                              Pending
                            </span>
                          )}
                        </div>
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
                  <td className="px-6 py-4">
                    {user.hasPendingApplication ? (
                      <div className="flex flex-col gap-1">
                        {user.pendingApplications.map((app: any) => (
                          <span 
                            key={app.id}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 rounded-full w-fit"
                          >
                            <Clock className="w-3 h-3" />
                            Pending {app.role}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewUser(user.id)}
                        className="px-3 py-1 text-xs font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors"
                      >
                        View
                      </button>
                      <DeleteUserButton userId={user.id} userName={user.fullName || user.email} />
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUserId && (
        <UserDetailsModal
          userId={selectedUserId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
