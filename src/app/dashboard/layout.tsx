
import { getSession, logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Calendar, User, LogOut, Store } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
          <Link href="/" className="text-xl font-bold text-brand-600">
            Rasaswadaya
          </Link>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
            {user.role} Dashboard
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-brand-600 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>

          {user.role === "ORGANIZER" && (
            <Link
              href="/dashboard/organizer"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-brand-600 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              My Events
            </Link>
          )}

          {user.role === "ARTIST" && (
            <Link
              href="/dashboard/artist"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-brand-600 transition-colors"
            >
              <User className="w-5 h-5" />
              Artist Profile
            </Link>
          )}
          
          {/* Everyone can see orders if they are a buyer too */}
          <Link
             href="/dashboard/orders"
             className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-brand-600 transition-colors"
          >
             <Store className="w-5 h-5" />
             My Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
              {user.email[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user.email}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
          </div>
          
          <form action={async () => {
            "use server";
            await logout();
            redirect("/login");
          }}>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
