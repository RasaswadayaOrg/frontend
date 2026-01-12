import { neon } from '@neondatabase/serverless';

export default function Page() {
  async function create(formData: FormData) {
    'use server';
    // Connect to the Neon database
    // Ensure DATABASE_URL is set in your .env file
    const sql = neon(`${process.env.DATABASE_URL}`);
    const comment = formData.get('comment');
    
    try {
        // Insert the comment from the form into the Postgres database
        await sql`CREATE TABLE IF NOT EXISTS comments (comment TEXT)`;
        await sql`INSERT INTO comments (comment) VALUES (${comment})`;
        console.log("Comment added successfully");
    } catch (e) {
        console.error("Error adding comment:", e);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-900">
        <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Test Database Connection</h1>
            <form action={create} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-zinc-300">Add a comment</label>
                    <input 
                        type="text" 
                        placeholder="write a comment" 
                        name="comment" 
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-brand-600 text-white py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
                >
                    Submit to DB
                </button>
            </form>
            <p className="mt-4 text-xs text-slate-500 text-center">
                Check your Neon Console to see the data.
            </p>
        </div>
    </div>
  );
}
