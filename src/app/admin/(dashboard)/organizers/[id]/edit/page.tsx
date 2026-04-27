import { getUser } from "@/lib/db";
import { OrganizerForm } from "@/components/admin/OrganizerForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditOrganizerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const organizer = await getUser(id);

  if (!organizer || organizer.role !== 'ORGANIZER') {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/organizers" 
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Organizer</h1>
          <p className="text-sm text-slate-500">Update organizer information.</p>
        </div>
      </div>

      <OrganizerForm initialData={organizer} isEdit />
    </div>
  );
}
