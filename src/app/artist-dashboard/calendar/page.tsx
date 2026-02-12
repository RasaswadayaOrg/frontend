import { EventCalendar } from "@/components/artist-dashboard/EventCalendar";

export default function ArtistCalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          My Calendar
        </h1>
        <p className="text-sm text-neutral-500 mt-1 max-w-lg">
          Manage your availability and view upcoming gigs. Organizers see your blocked dates as unavailable.
        </p>
      </div>
      <EventCalendar />
    </div>
  );
}
