import { AcademyForm } from "@/components/admin/AcademyForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getAcademy(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const res = await fetch(`${API_URL}/academies/${id}`, { cache: 'no-store' });
  
  if (!res.ok) return null;
  
  const data = await res.json();
  return data.data;
}

export default async function EditAcademyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const academy = await getAcademy(id);

  if (!academy) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/academies" 
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Academy</h1>
          <p className="text-sm text-slate-500">Update academy details.</p>
        </div>
      </div>

      <AcademyForm initialData={academy} isEdit={true} />
    </div>
  );
}
