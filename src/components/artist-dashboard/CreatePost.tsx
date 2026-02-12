"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Youtube,
  Users,
  Send,
  Bold,
  Italic,
  Smile,
} from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export function CreatePost() {
  const [content, setContent] = useState("");
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ content, youtubeLink });
    setContent("");
    setYoutubeLink("");
    setShowYoutubeInput(false);
    alert("Post created successfully! (Frontend Simulation)");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-5 mb-1">
      <div className="flex gap-3.5">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/20 overflow-hidden">
            <ImageWithFallback
              src="/api/avatar"
              alt="Me"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your artistic mind?"
              className="w-full bg-transparent border-none focus:ring-0 text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 resize-none min-h-[72px] p-0 text-sm leading-relaxed outline-none"
            />

            {showYoutubeInput && (
              <div className="mt-2 flex items-center gap-2 bg-neutral-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800">
                <Youtube className="w-4 h-4 text-red-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Paste YouTube link…"
                  className="bg-transparent border-none flex-1 focus:ring-0 text-neutral-700 dark:text-neutral-300 text-sm h-5 p-0 outline-none"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                />
              </div>
            )}

            {isCollaborating && (
              <div className="mt-2 flex items-center gap-2 bg-violet-50 dark:bg-violet-900/10 p-2.5 rounded-xl border border-violet-100 dark:border-violet-800/30">
                <Users className="w-4 h-4 text-violet-500 flex-shrink-0" />
                <select className="bg-transparent border-none flex-1 focus:ring-0 text-neutral-700 dark:text-neutral-300 text-sm h-5 py-0 outline-none">
                  <option>Select collaborator…</option>
                  <option>John Doe (Organizer)</option>
                  <option>Jane Smith (Violinist)</option>
                  <option>Colombo Jazz Festival</option>
                </select>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  className="p-2 text-neutral-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                  title="Photo"
                >
                  <ImageIcon className="w-[18px] h-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowYoutubeInput(!showYoutubeInput)}
                  className={`p-2 rounded-lg transition-colors ${
                    showYoutubeInput
                      ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                      : "text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  }`}
                  title="Video"
                >
                  <Youtube className="w-[18px] h-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCollaborating(!isCollaborating)}
                  className={`p-2 rounded-lg transition-colors ${
                    isCollaborating
                      ? "text-violet-600 bg-violet-50 dark:bg-violet-900/20"
                      : "text-neutral-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                  }`}
                  title="Collaborate"
                >
                  <Users className="w-[18px] h-[18px]" />
                </button>
                <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-1.5" />
                <button
                  type="button"
                  className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg transition-colors"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg transition-colors"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg transition-colors"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!content.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
              >
                Post <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
