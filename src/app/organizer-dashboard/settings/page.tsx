import Link from "next/link";

export default function OrganizerSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Organisation Settings
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Configure organiser account details, notifications, and booking preferences.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 dark:border-neutral-800/60 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
          Settings workspace
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          This page is available so primary navigation no longer dead-ends. Detailed organisation controls can be added after handover.
        </p>
        <Link
          href="/organizer-dashboard"
          className="mt-5 inline-flex rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Back to Overview
        </Link>
      </div>
    </div>
  );
}