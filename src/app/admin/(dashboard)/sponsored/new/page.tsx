import { SponsoredAdForm } from "@/components/admin/SponsoredAdForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewSponsoredAdPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/sponsored" 
          className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Sponsored Ad</h1>
          <p className="text-sm text-slate-500">Add a new sponsored advertisement</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6">
        <SponsoredAdForm />
      </div>
    </div>
  );
}
