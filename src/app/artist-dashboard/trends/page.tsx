import { TrendAnalytics } from "@/components/artist-dashboard/TrendAnalytics";

export default function ArtistTrendsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Trends & Analytics
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          See what's happening in the local art scene.
        </p>
      </div>
      <TrendAnalytics />
    </div>
  );
}
