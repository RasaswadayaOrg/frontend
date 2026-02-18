"use client";

import { useState, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  Youtube,
  Users,
  Send,
  Loader2,
  AlertCircle,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CreatePostProps {
  onPostCreated?: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [artistId, setArtistId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    // Fetch artist profile on mount to get ID
    const fetchArtistId = async () => {
      const token = localStorage.getItem("rasas_token");
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/artists/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setArtistId(data.id);
        }
      } catch (e) {
        console.error("Failed to fetch artist profile", e);
      }
    };
    fetchArtistId();
  }, [API_URL]);

  const validateYoutubeUrl = (url: string) => {
    if (!url) return true;
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return regex.test(url);
  };

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size must be less than 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    if (showYoutubeInput && youtubeLink && !validateYoutubeUrl(youtubeLink)) {
        setError("Please enter a valid YouTube URL");
        return;
    }

    if (!artistId) {
        setError("Artist profile not loaded. Please log in again.");
        return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("rasas_token");
      
      const formData = new FormData();
      formData.append("title", title); // Optional title
      formData.append("content", content);
      if (youtubeLink && showYoutubeInput) {
        formData.append("videoUrl", youtubeLink);
      }
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const res = await fetch(`${API_URL}/artists/${artistId}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create post");
      }

      // Reset form
      setContent("");
      setTitle("");
      setYoutubeLink("");
      setShowYoutubeInput(false);
      removeImage();
      
      // Refresh posts if parent component passes a refresh handler or router refresh
      router.refresh(); 
      // Ideally we would want to trigger a refresh in the parent component
      onPostCreated?.();
      
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <h2 className="text-xl font-bold mb-4">Create New Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Title Input */}
        <input
            type="text"
            placeholder="Post Title (Optional)"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 transition-colors"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />

        {/* Content Input */}
        <textarea
          placeholder="What on your mind?"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 min-h-[120px] text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Media Preview Section */}
        <div className="space-y-3">
          {showYoutubeInput && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste YouTube Link"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowYoutubeInput(false);
                    setYoutubeLink("");
                  }}
                  className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {youtubeLink && validateYoutubeUrl(youtubeLink) && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeID(youtubeLink)}`}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-zinc-700">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-auto object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            
            {/* Image Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                selectedImage ? "text-purple-400 bg-purple-400/10" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
              title="Add Image"
            >
              <ImageIcon className="w-5 h-5" />
              <span className="text-xs hidden sm:inline">Image</span>
            </button>
            
            {/* Youtube Button */}
            <button
              type="button"
              onClick={() => setShowYoutubeInput(!showYoutubeInput)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                showYoutubeInput ? "text-red-400 bg-red-400/10" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
              title="Add YouTube Video"
            >
              <Youtube className="w-5 h-5" />
              <span className="text-xs hidden sm:inline">Video</span>
            </button>

            {/* Collaborate Button (Placeholder) */}
            <button
              type="button"
              onClick={() => setIsCollaborating(!isCollaborating)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                isCollaborating ? "text-blue-400 bg-blue-400/10" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
              title="Tag Collaborator"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs hidden sm:inline">Collaborate</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}