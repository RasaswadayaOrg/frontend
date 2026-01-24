import { getAcademies, getAcademiesCount } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Search, MapPin, Phone, Mail, Globe } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { DeleteAcademyButton } from "@/app/admin/(dashboard)/academies/DeleteAcademyButton";

export const dynamic = 'force-dynamic';

export default async function AdminAcademiesPage() {
  const academies = await getAcademies(50, 1);
  const totalCount = await getAcademiesCount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Academies Management</h1>
          <p className="text-sm text-slate-500">{totalCount} total academies in the system.</p>
        </div>
        <Link href="/admin/academies/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add Academy
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search academies..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
         
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Academy</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {academies.map((academy: any) => (
                <tr key={academy.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-zinc-800 rounded-lg relative overflow-hidden flex-shrink-0">
                        <ImageWithFallback 
                          src={academy.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(academy.name)}&background=10b981&color=fff`}
                          alt={academy.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">{academy.name}</p>
                        <p className="text-xs text-slate-500 truncate">{academy.description?.substring(0, 50) || 'No description'}{academy.description?.length > 50 ? '...' : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {academy.type ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400">
                        {academy.type}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate max-w-[150px]">{academy.location || "—"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {academy.phone && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Phone className="w-3 h-3" />
                          <span>{academy.phone}</span>
                        </div>
                      )}
                      {academy.email && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[120px]">{academy.email}</span>
                        </div>
                      )}
                      {academy.website && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Globe className="w-3 h-3" />
                          <a href={academy.website} target="_blank" rel="noopener noreferrer" className="truncate max-w-[120px] hover:text-blue-600">
                            Website
                          </a>
                        </div>
                      )}
                      {!academy.phone && !academy.email && !academy.website && (
                        <span className="text-slate-400 italic text-xs">No contact info</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/academies/${academy.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteAcademyButton academyId={academy.id} academyName={academy.name} />
                    </div>
                  </td>
                </tr>
              ))}
              {academies.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No academies found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
