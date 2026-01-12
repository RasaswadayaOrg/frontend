
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ArtistProfilePage() {
  const session = await getSession();
  if (!session || session.user.role !== "ARTIST") {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Artist Profile</h1>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800">
        <p className="text-slate-500">Profile management coming soon...</p>
      </div>
    </div>
  );
}
