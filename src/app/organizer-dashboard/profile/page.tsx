import Link from "next/link";

export default function OrganizerProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Organiser Profile
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Manage the organiser details shown to artists and event partners.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 dark:border-neutral-800/60 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
          Profile settings are coming soon
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          For handover, this route now resolves instead of returning a 404. Use the event and talent tools while profile editing is completed.
        </p>
        <Link
          href="/organizer-dashboard/talent"
          className="mt-5 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Open Talent Hunt
        </Link>
      </div>
    </div>
  );
}