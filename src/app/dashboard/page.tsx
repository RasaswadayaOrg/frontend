
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Dashboard Overview
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2">Account Status</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">Active</p>
        </div>
        
        {user?.role === "ORGANIZER" && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2">Total Events</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
          </div>
        )}
        
        {user?.role === "ARTIST" && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2">Profile Views</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">No recent activity to show.</p>
      </div>
    </div>
  );
}
