
import Link from 'next/link';
import { Bell, TrendingUp, MapPin } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  eventDate: string | Date;
  location?: string; // Optional since backend doesn't fully support it yet
}

interface TrendingEvent {
  id: string;
  title: string;
  category: string;
}

interface SidebarStatsProps {
  reminders?: Reminder[];
  trendingEvents?: TrendingEvent[];
  city?: string;
  isLoggedIn: boolean;
}

export function SidebarStats({ reminders = [], trendingEvents = [], city, isLoggedIn }: SidebarStatsProps) {
  
  // Format date helper
  const getDayMonth = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleString('default', { month: 'short' }).toUpperCase(), // DEC
      day: d.getDate() // 20
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Reminders Card - Only if logged in AND has reminders */}
      {isLoggedIn && reminders.length > 0 && (
        <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-6 flex flex-col gap-4">
          
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
             <Bell className="w-5 h-5 text-[#B8A3F9]" /> {/* Using a lighter purple/heliotrope from design */ }
             <h3 className="text-lg font-bold text-[#EDEDED]">My Reminders</h3>
          </div>

          {/* List */}
          <div className="flex flex-col gap-4">
            {reminders.slice(0, 3).map((rem) => {
               const { month, day } = getDayMonth(rem.eventDate);
               return (
                <div key={rem.id} className="flex items-start gap-3">
                    {/* Date Box */}
                    <div className="w-12 h-12 bg-[#27272A] rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-[#62748E] leading-none mb-0.5">{month}</span>
                        <span className="text-lg font-bold text-white leading-none">{day}</span>
                    </div>
                    
                    {/* Details */}
                    <div className="flex flex-col pt-0.5">
                        <span className="text-sm text-[#EDEDED] leading-tight mb-1 line-clamp-2">{rem.title}</span>
                        <span className="text-xs text-[#62748E]">{rem.location || "Scheduled Event"}</span>
                    </div>
                </div>
               );
            })}
          </div>

          {/* Footer Link */}
          <div className="flex justify-center mt-1">
             <button className="text-xs text-[#62748E] hover:text-[#EDEDED] transition-colors">
                View all reminders
             </button>
          </div>

        </div>
      )}

      {/* Trending Card - Always show (or based on provided logic) */}
      <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-6 flex flex-col gap-4">
          
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
             <TrendingUp className="w-5 h-5 text-[#B8A3F9]" /> 
             <h3 className="text-lg font-bold text-[#EDEDED]">
                {city ? `Trending in ${city}` : "Trending in Sri Lanka"}
             </h3>
          </div>

          {/* List */}
          <div className="flex flex-col gap-4">
             {trendingEvents.map((evt, index) => (
                <div key={evt.id} className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#27272A] w-8 text-center flex-shrink-0">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm text-[#EDEDED] font-medium leading-tight">{evt.title}</span>
                        <span className="text-xs text-[#62748E]">{evt.category}</span>
                    </div>
                </div>
             ))}
          </div>

      </div>

    </div>
  );
}
