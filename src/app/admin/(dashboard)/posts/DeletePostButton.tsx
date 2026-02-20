"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/app/actions/admin";

export function DeletePostButton({ postId, postTitle }: { postId: string; postTitle: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the post "${postTitle || 'Untitled'}"? This action cannot be undone and will also delete all likes and comments.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deletePost(postId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
      title="Delete post"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
