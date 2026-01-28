import { RoleApplicationForm } from "@/components/RoleApplicationForm";
import { CalendarDays } from "lucide-react";

export default function OrganizerApplicationPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarDays className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Become an Organizer</h1>
        <p className="text-slate-600 dark:text-zinc-400">
          Start hosting events on our platform. Submit your details for verification.
        </p>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 md:p-8 shadow-sm">
        <RoleApplicationForm role="ORGANIZER" />
      </div>
    </div>
  );
}
