"use client";

import { useEffect, useState } from "react";
import { Camera, MapPin, Save, Store as StoreIcon, Image as ImageIcon } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ImageWithFallback } from "@/components/ImageWithFallback";

type Store = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  coverUrl: string | null;
  location: string | null;
  rating?: number;
  reviewCount?: number;
};

export function StoreProfileEditor() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    coverUrl: "",
    location: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await apiFetch<Store | null>("/stores/user/my-store");
      if (res.ok && res.data) {
        setStore(res.data);
        setForm({
          name: res.data.name || "",
          description: res.data.description || "",
          imageUrl: res.data.imageUrl || "",
          coverUrl: res.data.coverUrl || "",
          location: res.data.location || "",
        });
      }
      setLoading(false);
    })();
  }, []);

  const handleChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Store name is required" });
      return;
    }

    setSaving(true);
    setMessage(null);

    const res = store
      ? await apiFetch<Store>(`/stores/${store.id}`, { method: "PUT", json: form })
      : await apiFetch<Store>("/stores", { method: "POST", json: form });

    if (res.ok && res.data) {
      setStore(res.data);
      setMessage({
        type: "success",
        text: store ? "Store updated" : "Store created — you can now add products",
      });
    } else {
      setMessage({ type: "error", text: res.ok ? "Failed to save store" : res.error || "Failed to save store" });
    }
    setSaving(false);
  };

  const promptForUrl = (label: string, current: string) => {
    const next = window.prompt(`${label} URL`, current || "");
    return next === null ? current : next;
  };

  const inputClass =
    "w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors";

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-b-2 border-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden"
    >
      {/* Cover */}
      <div className="h-44 relative bg-gradient-to-r from-brand-500 to-fuchsia-500">
        {form.coverUrl && (
          <ImageWithFallback
            src={form.coverUrl}
            alt="Cover"
            fill
            className="object-cover"
          />
        )}
        <button
          type="button"
          onClick={() =>
            setForm((f) => ({ ...f, coverUrl: promptForUrl("Cover image", f.coverUrl) }))
          }
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors"
        >
          <Camera className="w-3.5 h-3.5" /> Change Cover
        </button>
      </div>

      <div className="px-6 sm:px-8 pb-8">
        {/* Avatar & Save */}
        <div className="relative -mt-14 mb-6 flex justify-between items-end">
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl border-4 border-white dark:border-zinc-900 overflow-hidden bg-neutral-200 shadow-lg">
              <ImageWithFallback
                src={form.imageUrl || "/logo.svg"}
                alt="Store logo"
                width={112}
                height={112}
                className="object-cover h-full w-full"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({ ...f, imageUrl: promptForUrl("Store logo", f.imageUrl) }))
              }
              className="absolute bottom-1 right-1 bg-white dark:bg-zinc-800 p-1.5 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-brand-200/40 dark:hover:shadow-none active:scale-[0.98]"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving…" : store ? "Save Changes" : "Create Store"}
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 text-sm rounded-xl px-4 py-3 border ${
              message.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                className={inputClass}
                placeholder="e.g. Lanka Handloom Crafts"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Description
              </label>
              <textarea
                rows={5}
                value={form.description}
                onChange={handleChange("description")}
                placeholder="Tell buyers what makes your store unique…"
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={form.location}
                  onChange={handleChange("location")}
                  placeholder="City or district"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-semibold mb-3.5 text-neutral-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-brand-500" /> Media
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={handleChange("imageUrl")}
                    placeholder="https://…"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Cover URL
                  </label>
                  <input
                    type="text"
                    value={form.coverUrl}
                    onChange={handleChange("coverUrl")}
                    placeholder="https://…"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {store && (
              <div className="p-4 rounded-2xl border border-brand-100 dark:border-brand-800/40 bg-gradient-to-br from-brand-50 to-fuchsia-50/60 dark:from-brand-900/20 dark:to-fuchsia-900/10">
                <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300 text-[11px] font-bold uppercase tracking-wide mb-3">
                  <StoreIcon className="w-3.5 h-3.5" /> Store Stats
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[11px] text-neutral-500">Rating</p>
                    <p className="font-semibold text-neutral-900 dark:text-white mt-0.5">
                      {store.rating?.toFixed(1) ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-neutral-500">Reviews</p>
                    <p className="font-semibold text-neutral-900 dark:text-white mt-0.5">
                      {store.reviewCount ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
