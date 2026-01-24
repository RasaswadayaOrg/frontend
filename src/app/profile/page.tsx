"use client";

import { User, MapPin, Bell, Heart, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/app/actions/user";
import { fetchUserPreferences } from "@/app/actions/preferences";
import { updateUserLocation } from "@/app/actions/updateLocation";
import { updateUserPreferences } from "@/app/actions/updatePreferences";
import { fetchMyApplications } from "@/app/actions/roleApplication";
import RoleApplicationForm from "@/components/RoleApplicationForm";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [applicationModal, setApplicationModal] = useState<"ARTIST" | "ORGANIZER" | null>(null);
  const [editing, setEditing] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchCurrentUser().then(setProfile);
    fetchUserPreferences().then((prefs) => {
      setPreferences(prefs);
      setSelectedInterests(prefs?.interests || []);
      setSelectedCategories(prefs?.categories || []);
    });
    fetchMyApplications().then(setApplications);
  }, []);
  // Interests edit logic
  const allInterests = ['Music', 'Dance', 'Drama', 'Art', 'History'];
  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };


  // Preferences edit logic
  const allCategories = ['Concerts', 'Workshops', 'Exhibitions', 'Talks'];
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };


  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  const handleSaveLocation = async () => {
    // kept for backward-compat; prefer unified save
    if (selectedCity && selectedCity !== profile?.city) {
      await updateUserLocation(selectedCity);
      const updated = await fetchCurrentUser();
      setProfile(updated);
      setSelectedCity(updated?.city || "");
    }
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setSelectedCity(profile?.city || "");
    setSelectedInterests(preferences?.interests || []);
    setSelectedCategories(preferences?.categories || []);
  };

  // Unified save and cancel for all editable profile sections
  const handleSaveAll = async () => {
    // Save location if changed
    if (selectedCity && selectedCity !== profile?.city) {
      await updateUserLocation(selectedCity);
    }
    // Save preferences (categories + interests)
    await updateUserPreferences({ categories: selectedCategories, interests: selectedInterests });

    // Refresh both profile and preferences
    const updated = await fetchCurrentUser();
    setProfile(updated);
    const prefs = await fetchUserPreferences();
    setPreferences(prefs);
    setSelectedInterests(prefs?.interests || []);
    setSelectedCategories(prefs?.categories || []);
    setSelectedCity(updated?.city || "");
    setEditing(false);
  };

  const handleCancelAll = () => {
    setSelectedCity(profile?.city || "");
    setSelectedInterests(preferences?.interests || []);
    setSelectedCategories(preferences?.categories || []);
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const hasPendingArtist = applications?.some(a => a.role === 'ARTIST' && a.status === 'PENDING');
  const hasPendingOrganizer = applications?.some(a => a.role === 'ORGANIZER' && a.status === 'PENDING');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: User Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 text-center">
            <div className="w-24 h-24 bg-slate-200 dark:bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="font-bold text-lg">{profile?.fullName || "Guest User"}</h2>
            <p className="text-sm text-slate-500 mb-4">{profile?.email || "guest@example.com"}</p>
            <div className="text-sm text-slate-500 mb-2">{profile?.phone && `Phone: ${profile.phone}`}</div>
            <div className="text-sm text-slate-500 mb-2">{profile?.city && `City: ${profile.city}`}</div>
            {!editing ? (
              <button
                className="text-sm text-brand-600 font-medium hover:underline mb-2 block w-full"
                onClick={() => {
                  setSelectedCity(profile?.city || "");
                  setSelectedInterests(preferences?.interests || []);
                  setSelectedCategories(preferences?.categories || []);
                  setEditing(true);
                }}
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2 mb-2 justify-center">
                <button
                  className="text-sm text-brand-600 font-medium hover:underline px-4 py-1 rounded-xl border border-brand-200 bg-brand-50"
                  onClick={handleSaveAll}
                >
                  Save
                </button>
                <button
                  className="text-sm text-slate-500 font-medium hover:underline px-4 py-1 rounded-xl border border-slate-200 bg-slate-50"
                  onClick={handleCancelAll}
                >
                  Cancel
                </button>
              </div>
            )}
            
            <button 
              onClick={handleLogout}
              className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>

            {/* Role Applications */}
            <div className="border-t border-slate-100 dark:border-zinc-800 pt-4 mt-4 space-y-2">
               {profile?.role === 'USER' ? (
                  <>
                    {!hasPendingArtist ? (
                        <button 
                            onClick={() => setApplicationModal('ARTIST')}
                            className="w-full py-2 px-4 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors"
                        >
                           Become an Artist
                        </button>
                    ) : (
                        <div className="w-full py-2 px-4 text-xs font-medium text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-xl">
                           Artist Application Pending
                        </div>
                    )}

                    {!hasPendingOrganizer ? (
                        <button 
                             onClick={() => setApplicationModal('ORGANIZER')}
                             className="w-full py-2 px-4 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
                        >
                           Become an Organizer
                        </button>
                    ) : (
                        <div className="w-full py-2 px-4 text-xs font-medium text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-xl">
                           Organizer Application Pending
                        </div>
                    )}
                  </>
               ) : profile?.role && profile.role !== 'ADMIN' && (
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 border border-brand-100">
                    Role: {profile.role}
                  </div>
               )}
            </div>
          </div>
        </div>

        {/* Right: Settings & Preferences */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Location */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" /> Location
            </h3>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mb-4">
              Set your city to get personalized event recommendations.
            </p>
            <select
              className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5"
              value={editing ? selectedCity : profile?.city || ""}
              onChange={editing ? handleLocationChange : undefined}
              disabled={!editing}
            >
              <option value="">Select your city</option>
              <option value="Colombo">Colombo</option>
              <option value="Kandy">Kandy</option>
              <option value="Galle">Galle</option>
            </select>
          </div>

          {/* Interests */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-600" /> My Interests
            </h3>
            {!editing ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {(preferences?.interests?.length ? preferences.interests : allInterests).map((interest: string) => (
                  <span key={interest} className="px-4 py-2 rounded-full text-sm border border-slate-200 dark:border-zinc-700 bg-brand-50 text-brand-600 border-brand-200">
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mb-2">
                {allInterests.map((interest) => (
                  <label key={interest} className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={selectedInterests.includes(interest)}
                      onChange={() => handleInterestToggle(interest)}
                    />
                    <span className={`px-4 py-2 rounded-full text-sm border border-slate-200 dark:border-zinc-700 ${selectedInterests.includes(interest) ? 'bg-brand-50 text-brand-600 border-brand-200' : ''}`}>
                      {interest}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Preferences Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-600" /> Preferences
            </h3>
            {!editing ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {(preferences?.categories?.length ? preferences.categories : allCategories).map((category: string) => (
                  <span key={category} className="px-4 py-2 rounded-full text-sm border border-slate-200 dark:border-zinc-700 bg-brand-50 text-brand-600 border-brand-200">
                    {category}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mb-2">
                {allCategories.map((category) => (
                  <label key={category} className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <span className={`px-4 py-2 rounded-full text-sm border border-slate-200 dark:border-zinc-700 ${selectedCategories.includes(category) ? 'bg-brand-50 text-brand-600 border-brand-200' : ''}`}>
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Reminders */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-600" /> Upcoming Reminders
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl">
                <div>
                  <h4 className="font-medium text-sm font-sinhala">සිංහබාහු</h4>
                  <p className="text-xs text-slate-500">Dec 18 • 6:30 PM</p>
                </div>
                <button className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {applicationModal && (
        <RoleApplicationForm
          role={applicationModal}
          onClose={() => setApplicationModal(null)}
          onSuccess={() => {
            fetchMyApplications().then(setApplications);
            setApplicationModal(null);
          }}
        />
      )}
    </div>
  );
}
