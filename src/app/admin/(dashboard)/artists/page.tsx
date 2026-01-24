import { getArtists, getArtistsCount } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Users } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { DeleteArtistButton } from "@/app/admin/(dashboard)/artists/DeleteArtistButton";

export const dynamic = 'force-dynamic';

export default async function AdminArtistsPage() {
  const artists = await getArtists(50, 1);
  const totalCount = await getArtistsCount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Artists Management</h1>
          <p className="text-sm text-slate-500">{totalCount} total artists in the system.</p>
        </div>
        <Link href="/admin/artists/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add Artist
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search artists..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
         
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Artist</th>
                <th className="px-6 py-4">Profession</th>
                <th className="px-6 py-4">Genre</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Followers</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {artists.map((artist: any) => (
                <tr key={artist.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-zinc-800 rounded-full relative overflow-hidden flex-shrink-0">
                        <ImageWithFallback 
                          src={artist.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=random`}
                          alt={artist.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">{artist.name}</p>
                        <p className="text-xs text-slate-500 truncate">{artist.bio?.substring(0, 50) || 'No bio'}{artist.bio?.length > 50 ? '...' : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {artist.profession ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {artist.profession}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {artist.genre ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                        {artist.genre}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {artist.location || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Users className="w-4 h-4" />
                      <span>{artist.followerCount || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/artists/${artist.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteArtistButton artistId={artist.id} artistName={artist.name} />
                    </div>
                  </td>
                </tr>
              ))}
              {artists.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No artists found. Add one to get started.
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
