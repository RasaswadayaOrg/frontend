"use client";

import { User, MapPin, Bell, Heart, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: User Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 text-center">
            <div className="w-24 h-24 bg-slate-200 dark:bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="font-bold text-lg">{user?.name || "Guest User"}</h2>
            <p className="text-sm text-slate-500 mb-4">{user?.email || "guest@example.com"}</p>
            <button className="text-sm text-brand-600 font-medium hover:underline mb-2 block w-full">Edit Profile</button>
            
            <button 
              onClick={handleLogout}
              className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Right: Settings & Preferences */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Location */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" /> Location
            </h3>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mb-4">
              Set your city to get personalized event recommendations.
            </p>
            <select className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5">
              <option>Colombo</option>
              <option>Kandy</option>
              <option>Galle</option>
            </select>
          </div>

          {/* Interests */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-600" /> My Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Music', 'Dance', 'Drama', 'Art', 'History'].map((interest) => (
                <label key={interest} className="cursor-pointer">
                  <input type="checkbox" className="peer sr-only" defaultChecked={['Music', 'Drama'].includes(interest)} />
                  <span className="px-4 py-2 rounded-full text-sm border border-slate-200 dark:border-zinc-700 peer-checked:bg-brand-50 peer-checked:text-brand-600 peer-checked:border-brand-200 transition-all">
                    {interest}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-600" /> Upcoming Reminders
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl">
                <div>
                  <h4 className="font-medium text-sm font-sinhala">සිංහබාහු</h4>
                  <p className="text-xs text-slate-500">Dec 18 • 6:30 PM</p>
                </div>
                <button className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
