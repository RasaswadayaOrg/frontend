"use client";

import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { AlertCircle, Camera, CheckCircle2, Globe, Instagram, Link as LinkIcon, Loader2, MapPin, Save } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { FacebookConnect } from "./FacebookConnect";

type ArtistProfile = {
  id: string;
  name: string;
  profession: string;
  genre: string;
  bio?: string | null;
  photoUrl?: string | null;
  coverUrl?: string | null;
  location?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  fbPageId?: string | null;
};

const emptyForm = {
  name: "",
  profession: "",
  genre: "",
  bio: "",
  photoUrl: "",
  coverUrl: "",
  location: "",
  website: "",
  instagram: "",
  facebook: "",
};

export function ArtistProfileEditor() {
  const { user } = useAuth();
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchArtist() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const res = await apiFetch<ArtistProfile>("/artists/me");
      if (!isMounted) return;

      if (!res.ok || !res.data) {
        setError(res.ok ? "Artist profile not found." : res.error || "Failed to load artist profile.");
        setLoading(false);
        return;
      }

      setArtist(res.data);
      setForm({
        name: res.data.name || user.name || "",
        profession: res.data.profession || "",
        genre: res.data.genre || "",
        bio: res.data.bio || "",
        photoUrl: res.data.photoUrl || user.avatarUrl || "",
        coverUrl: res.data.coverUrl || "",
        location: res.data.location || user.city || "",
        website: res.data.website || "",
        instagram: res.data.instagram || "",
        facebook: res.data.facebook || "",
      });
      setLoading(false);
    }

    fetchArtist();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSuccess(false);
  };

  const promptForUrl = (label: string, current: string) => {
    const next = window.prompt(`${label} URL`, current || "");
    if (next !== null) update(label === "Profile photo" ? "photoUrl" : "coverUrl", next);
  };

  const triggerAiRefresh = () => {
    const aiUrl = process.env.NEXT_PUBLIC_AI_API_URL;
    if (!aiUrl) return;
    fetch(`${aiUrl.replace(/\/$/, "")}/refresh`, { method: "POST" }).catch((refreshError) => {
      console.warn("AI refresh failed:", refreshError);
    });
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!artist) {
      setError("Artist profile not found.");
      return;
    }

    if (!form.name.trim() || !form.profession.trim() || !form.genre.trim()) {
      setError("Display name, primary art form, and genre are required.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    const payload = {
      name: form.name.trim(),
      profession: form.profession.trim(),
      genre: form.genre.trim(),
      bio: form.bio.trim() || null,
      photoUrl: form.photoUrl.trim() || null,
      coverUrl: form.coverUrl.trim() || null,
      location: form.location.trim() || null,
      website: form.website.trim() || null,
      instagram: form.instagram.trim() || null,
      facebook: form.facebook.trim() || null,
    };

    const res = await apiFetch<ArtistProfile>(`/artists/${artist.id}`, {
      method: "PUT",
      json: payload,
    });

    if (res.ok && res.data) {
      setArtist(res.data);
      setForm({
        name: res.data.name || "",
        profession: res.data.profession || "",
        genre: res.data.genre || "",
        bio: res.data.bio || "",
        photoUrl: res.data.photoUrl || "",
        coverUrl: res.data.coverUrl || "",
        location: res.data.location || "",
        website: res.data.website || "",
        instagram: res.data.instagram || "",
        facebook: res.data.facebook || "",
      });
      setSuccess(true);
      triggerAiRefresh();
    } else {
      setError(res.ok ? "Save failed. Please try again." : res.error || "Save failed. Please try again.");
    }

    setSaving(false);
  };

  const inputClass =
    "w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors text-neutral-900 dark:text-white placeholder:text-neutral-400";

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden"
    >
      <div className="h-44 bg-gradient-to-r from-brand-500 to-fuchsia-500 relative overflow-hidden">
        {form.coverUrl && (
          <ImageWithFallback src={form.coverUrl} alt="Artist cover image" fill className="object-cover" />
        )}
        <button
          type="button"
          onClick={() => promptForUrl("Cover image", form.coverUrl)}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors"
        >
          <Camera className="w-3.5 h-3.5" /> Change Cover
        </button>
      </div>

      <div className="px-6 sm:px-8 pb-8">
        <div className="relative -mt-14 mb-6 flex justify-between items-end gap-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl border-4 border-white dark:border-zinc-900 overflow-hidden bg-neutral-200 shadow-lg">
              <ImageWithFallback
                src={form.photoUrl || user?.avatarUrl || "/api/avatar"}
                alt={form.name ? `${form.name} profile photo` : "Artist profile photo"}
                width={112}
                height={112}
                className="object-cover h-full w-full"
              />
            </div>
            <button
              type="button"
              aria-label="Change profile photo"
              onClick={() => promptForUrl("Profile photo", form.photoUrl)}
              className="absolute bottom-1 right-1 bg-white dark:bg-zinc-800 p-1.5 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
          <button
            type="submit"
            disabled={saving || !artist}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-brand-200/40 dark:hover:shadow-none active:scale-[0.98]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div>
              <p>{error}</p>
              <button type="submit" className="mt-2 font-semibold underline" disabled={saving || !artist}>
                Try again
              </button>
            </div>
          </div>
        )}

        {success && (
          <div role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            Profile saved successfully.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Display Name
              </label>
              <input type="text" value={form.name} onChange={(event) => update("name", event.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Primary Art Form
              </label>
              <input
                type="text"
                value={form.profession}
                onChange={(event) => update("profession", event.target.value)}
                placeholder="e.g. Kandyan dancer, vocalist, violinist"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Genre / Style
              </label>
              <input
                type="text"
                value={form.genre}
                onChange={(event) => update("genre", event.target.value)}
                placeholder="e.g. Ves dance, folk fusion, classical"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Bio
              </label>
              <textarea
                rows={5}
                value={form.bio}
                onChange={(event) => update("bio", event.target.value)}
                placeholder="Tell organizers about your style, experience, repertoire, languages, and performance mood."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold mb-3.5 text-neutral-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-500" /> Location
              </h3>
              <input
                type="text"
                value={form.location}
                onChange={(event) => update("location", event.target.value)}
                placeholder="Colombo"
                className={inputClass}
              />
            </div>

            <div>
              <h3 className="text-xs font-semibold mb-3.5 text-neutral-900 dark:text-white flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5 text-brand-500" /> Social Links
              </h3>
              <div className="space-y-2.5">
                <div className="relative">
                  <Instagram className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={(event) => update("instagram", event.target.value)}
                    placeholder="Instagram username"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="url"
                    value={form.website}
                    onChange={(event) => update("website", event.target.value)}
                    placeholder="Portfolio website"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="url"
                    value={form.facebook}
                    onChange={(event) => update("facebook", event.target.value)}
                    placeholder="Facebook page URL"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Suspense fallback={null}>
            <FacebookConnect artistId={artist?.id || null} isConnected={!!artist?.fbPageId} />
          </Suspense>
        </div>
      </div>
    </form>
  );
}