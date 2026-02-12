import { ArtistProfileEditor } from "@/components/artist-dashboard/ArtistProfileEditor";

export default function ArtistProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Edit Profile
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Keep your profile up to date for organizers.
        </p>
      </div>
      <ArtistProfileEditor />
    </div>
  );
}
