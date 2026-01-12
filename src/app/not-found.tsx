import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-brand-50 dark:bg-brand-900/20 w-24 h-24 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🤔</span>
      </div>
      <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 mb-4">
        Page Not Found
      </h2>
      <p className="text-slate-600 dark:text-zinc-400 max-w-md mb-8">
        We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
      </p>
      <Link 
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-brand-500/20"
      >
        <Home className="w-5 h-5" />
        Return Home
      </Link>
    </div>
  );
}
