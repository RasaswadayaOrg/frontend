import { BookingRequestList } from "@/components/artist-dashboard/BookingRequestList";

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Booking Requests
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage incoming gig offers from organizers.
          </p>
        </div>
        <select className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800/80 px-3.5 py-2 rounded-xl text-sm font-medium outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors">
          <option>All Status</option>
          <option>Pending</option>
          <option>Accepted</option>
          <option>Past</option>
        </select>
      </div>

      <BookingRequestList />
    </div>
  );
}
