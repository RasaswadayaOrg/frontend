import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rasaswadaya Admin',
  description: 'Super Admin Control Center',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100">
      {children}
    </div>
  )
}
