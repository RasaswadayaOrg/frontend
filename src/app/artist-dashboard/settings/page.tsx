import Link from "next/link";

export default function ArtistSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Manage account preferences for your artist workspace.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 dark:border-neutral-800/60 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
          Settings workspace
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          This page is available so the artist sidebar no longer points to a missing route. Use profile editing for public artist details.
        </p>
        <Link
          href="/artist-dashboard/profile"
          className="mt-5 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Edit Public Profile
        </Link>
      </div>
    </div>
  );
}