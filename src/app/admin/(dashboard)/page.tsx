import Link from "next/link";
import { 
  Users, 
  ShoppingBag, 
  Calendar, 
  Mic2,
  School,
  TrendingUp,
  Activity,
  Package
} from "lucide-react";
import { getAdminStats, getRecentActivity } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const recentActivity = await getRecentActivity(8);

  const dashboardStats = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      href: "/admin/users"
    },
    {
      title: "Total Artists",
      value: stats.totalArtists.toString(),
      icon: Mic2,
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
      href: "/admin/artists"
    },
    {
      title: "Total Events",
      value: stats.totalEvents.toString(),
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      href: "/admin/events"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: Package,
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      href: "/admin/marketplace"
    },
    {
      title: "Total Artists",
      value: stats.totalArtists.toString(),
      icon: Mic2,
      color: "text-pink-500",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      href: "/admin/artists"
    },
    {
      title: "Total Academies",
      value: stats.totalAcademies.toString(),
      icon: School,
      color: "text-cyan-500",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/20",
      href: "/admin/academies"
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      icon: ShoppingBag,
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
      href: "/admin/marketplace"
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-4 h-4 text-green-500" />;
      case 'user': return <Users className="w-4 h-4 text-blue-500" />;
      case 'event': return <Calendar className="w-4 h-4 text-purple-500" />;
      default: return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatTime = (time: string) => {
    try {
      return formatDistanceToNow(new Date(time), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Welcome back, Admin. Here's your platform overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.slice(0, 4).map((stat, index) => (
          <Link 
            key={index} 
            href={stat.href}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardStats.slice(4).map((stat, index) => (
          <Link 
            key={index} 
            href={stat.href}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-5">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 dark:text-slate-200">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}{" "}
                      <span className="font-medium">{activity.target}</span>
                      {activity.status && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          activity.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                          activity.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {activity.status}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{formatTime(activity.time)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">No recent activity found.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Quick Actions
            </h2>
          </div>
          <div className="space-y-3">
            <Link 
              href="/admin/events"
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Manage Events</span>
            </Link>
            
            <Link 
              href="/admin/artists"
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-300 dark:border-zinc-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40">
                <Mic2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Manage Artists</span>
            </Link>

            <Link 
              href="/admin/marketplace"
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-300 dark:border-zinc-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40">
                <ShoppingBag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">View Marketplace</span>
            </Link>

            <Link 
              href="/admin/users"
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-300 dark:border-zinc-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/40">
                <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Manage Users</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
