import { getAdminStats } from "@/lib/db";
import { Settings, Database, Server, Shield, Bell, Palette } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your platform settings and configurations.</p>
      </div>

      {/* System Overview */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <Database className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">System Overview</h2>
            <p className="text-sm text-slate-500">Current database statistics</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-lg p-4">
            <p className="text-sm text-slate-500">Users</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</p>
          </div>
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-lg p-4">
            <p className="text-sm text-slate-500">Events</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalEvents}</p>
          </div>
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-lg p-4">
            <p className="text-sm text-slate-500">Artists</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalArtists}</p>
          </div>
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-lg p-4">
            <p className="text-sm text-slate-500">Products</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalProducts}</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/20">
              <Settings className="w-5 h-5 text-brand-600" />
            </div>
            <h2 className="font-semibold text-slate-900 dark:text-white">General Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Site Name
              </label>
              <input
                type="text"
                defaultValue="Rasas"
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Support Email
              </label>
              <input
                type="email"
                defaultValue="support@rasas.lk"
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Default Currency
              </label>
              <select className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="LKR">LKR - Sri Lankan Rupee</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Require 2FA for admin accounts</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-zinc-700">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Session Timeout</p>
                <p className="text-xs text-slate-500">Auto logout after inactivity</p>
              </div>
              <select className="px-3 py-1 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Email Notifications</p>
                <p className="text-xs text-slate-500">Receive email for new orders</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">New User Alerts</p>
                <p className="text-xs text-slate-500">Notify when new users register</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <Server className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="font-semibold text-slate-900 dark:text-white">API Configuration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                API Endpoint
              </label>
              <input
                type="text"
                value={process.env.NEXT_PUBLIC_API_URL || '/api'}
                readOnly
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Environment
              </label>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                {process.env.NODE_ENV || 'development'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
