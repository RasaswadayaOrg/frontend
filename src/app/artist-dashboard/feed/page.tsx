import { CreatePost } from "@/components/artist-dashboard/CreatePost";
import { FeedPost } from "@/components/artist-dashboard/FeedPost";

const POSTS = [
  {
    id: "1",
    author: {
      name: "Ravi Shankar",
      handle: "ravimusic",
      avatar: "https://i.pravatar.cc/150?u=ravi",
      isVerified: true,
    },
    content:
      "Excited to announce my collaboration with the National Symphony Orchestra! We will be exploring the fusion of Eastern and Western classical traditions. 🎻🕉️ #FusionMusic #Classical",
    timestamp: "2 hours ago",
    image:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 124,
    comments: 18,
    collaborator: { name: "National Symphony", role: "Organizer" },
  },
  {
    id: "2",
    author: {
      name: "Amara Perera",
      handle: "amaradance",
      avatar: "https://i.pravatar.cc/150?u=amara",
    },
    content:
      "Just posted a new choreography video. Check it out and let me know what you think! Learning Kandyan dance has been a journey. 👇",
    timestamp: "5 hours ago",
    video: "https://youtube.com/watch?v=mock",
    likes: 89,
    comments: 12,
  },
  {
    id: "3",
    author: {
      name: "Electronic Bates",
      handle: "ebates",
      avatar: "https://i.pravatar.cc/150?u=bates",
      isVerified: true,
    },
    content:
      "Looking for a vocalist for my upcoming track. Techno vibes. Hit me up if interested! 🎹🎤",
    timestamp: "1 day ago",
    likes: 45,
    comments: 32,
  },
];

const TRENDS = [
  { title: "#TraditionalArts", count: "12.5k posts" },
  { title: "#ColomboJazz", count: "8.2k posts" },
  { title: "Kandy Esala Perahera", count: "Trending in Events" },
  { title: "#ModernFusion", count: "5.1k posts" },
  { title: "Street Food Festival", count: "Coming soon" },
];

export default function ArtistFeedPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Feed Column */}
      <div className="lg:col-span-2 space-y-4">
        <CreatePost />
        {POSTS.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24 space-y-5">
          {/* Trends */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800/60">
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                Trends for you
              </h3>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {TRENDS.map((trend, i) => (
                <div
                  key={i}
                  className="px-5 py-3 hover:bg-neutral-50/80 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors duration-200"
                >
                  <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-violet-600 transition-colors">
                    {trend.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    {trend.count}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800/60">
              <button className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors">
                Show more →
              </button>
            </div>
          </div>

          {/* Who to Follow */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800/60">
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                Who to follow
              </h3>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {[
                { name: "Sithara Madushani", role: "Classical Vocalist" },
                { name: "Kasun Kalhara", role: "Composer" },
                { name: "Umaria", role: "Pop Artist" },
              ].map((person, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {person.name}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {person.role}
                      </div>
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-violet-600 hover:text-violet-700 px-3 py-1.5 border border-violet-200 dark:border-violet-800 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
