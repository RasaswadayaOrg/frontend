import { getSponsoredAds, getSponsoredAdsCount } from "@/lib/db";
import Link from "next/link";
import { Plus, Image, ExternalLink, Eye, MousePointer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DeleteAdButton } from "./DeleteAdButton";
import { ToggleAdStatus } from "./ToggleAdStatus";

export const dynamic = 'force-dynamic';

const placementLabels: Record<string, string> = {
  'home-sidebar': 'Home Sidebar',
  'home-banner': 'Home Banner',
  'home-seasonal': 'Seasonal Promotion',
  'marketplace-banner': 'Marketplace Banner',
  'events-sidebar': 'Events Sidebar',
};

const sizeLabels: Record<string, string> = {
  'small': 'Small (128px)',
  'medium': 'Medium (256px)',
  'large': 'Large (384px)',
  'banner': 'Banner (96px)',
  'leaderboard': 'Leaderboard (128px)',
};

export default async function AdminSponsoredPage() {
  const ads = await getSponsoredAds(50, 1);
  const totalCount = await getSponsoredAdsCount();

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sponsored Ads</h1>
          <p className="text-sm text-slate-500">{totalCount} sponsored ads in the system.</p>
        </div>
        <Link
          href="/admin/sponsored/new"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Ad
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-violet-500" />
            <span className="text-xs font-medium text-slate-500">Total Ads</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalCount}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-slate-500">Active</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {ads.filter((ad: any) => ad.isActive).length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-slate-500">Total Clicks</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {ads.reduce((sum: number, ad: any) => sum + (ad.clicks || 0), 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-slate-500">Total Impressions</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {ads.reduce((sum: number, ad: any) => sum + (ad.impressions || 0), 0)}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Ad Preview</th>
                <th className="px-6 py-4">Placement</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Stats</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {ads.map((ad: any) => (
                <tr key={ad.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-12 bg-slate-100 dark:bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                        {ad.imageUrl ? (
                          <img 
                            src={ad.imageUrl} 
                            alt={ad.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="w-6 h-6 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">{ad.title}</p>
                        {ad.linkUrl && (
                          <a 
                            href={ad.linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline flex items-center gap-1 truncate max-w-[200px]"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {ad.linkUrl}
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400 rounded">
                      {placementLabels[ad.placement] || ad.placement}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {sizeLabels[ad.size] || ad.size}
                  </td>
                  <td className="px-6 py-4">
                    <ToggleAdStatus adId={ad.id} isActive={ad.isActive} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1 text-slate-500">
                        <MousePointer className="w-3 h-3" />
                        <span>{ad.clicks || 0} clicks</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Eye className="w-3 h-3" />
                        <span>{ad.impressions || 0} views</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {formatDate(ad.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/sponsored/${ad.id}/edit`} 
                        className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteAdButton adId={ad.id} adTitle={ad.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {ads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No sponsored ads found. <Link href="/admin/sponsored/new" className="text-violet-600 hover:underline">Create one now</Link>
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
