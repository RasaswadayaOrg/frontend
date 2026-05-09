import { RoleApplicationForm } from "@/components/RoleApplicationForm";
import { Palette } from "lucide-react";

export default function ArtistApplicationPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Palette className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Become an Artist</h1>
        <p className="text-slate-600 dark:text-zinc-400">
          Join our community of performers. Submit your details below for verification.
        </p>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 md:p-8 shadow-sm">
        <RoleApplicationForm role="ARTIST" />
      </div>
    </div>
  );
}
