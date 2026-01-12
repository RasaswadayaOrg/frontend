import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-lg shadow-brand-500/10 p-8 border border-slate-200 dark:border-zinc-800">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-slate-600 dark:text-zinc-400">Sign in to continue to Rasaswadaya</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-brand-600 rounded-xl px-4 py-3 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-brand-600 rounded-xl px-4 py-3 transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex justify-end">
            <a href="#" className="text-sm text-brand-600 hover:underline">Forgot password?</a>
          </div>

          <button className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-zinc-400">
          Don't have an account? <Link href="/auth/register" className="text-brand-600 font-medium hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
