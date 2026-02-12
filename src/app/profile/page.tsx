"use client";

import { User, MapPin, Bell, Heart, LogOut, X, Upload, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/app/actions/user";
import { fetchUserPreferences } from "@/app/actions/preferences";
import { updateUserLocation } from "@/app/actions/updateLocation";
import { updateUserPreferences } from "@/app/actions/updatePreferences";

type RoleType = 'ARTIST' | 'ORGANIZER' | 'SELLER' | 'TEACHER';

interface RoleDocuments {
  [key: string]: File | null;
}

interface RoleTextFields {
  [key: string]: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const { logout } = useAuth();
  const router = useRouter();

  // Role Upgrade Modal State
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>([]);
  const [roleDocuments, setRoleDocuments] = useState<RoleDocuments>({});
  const [roleTextFields, setRoleTextFields] = useState<RoleTextFields>({});
  const [reason, setReason] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchCurrentUser().then(setProfile);
    fetchUserPreferences().then((prefs) => {
      setPreferences(prefs);
      setSelectedInterests(prefs?.interests || []);
      setSelectedCategories(prefs?.categories || []);
    });
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

  // Role Upgrade Modal Functions
  const availableRoles: {value: RoleType, label: string}[] = [
    { value: 'ARTIST', label: 'Artist' },
    { value: 'ORGANIZER', label: 'Organizer' },
    { value: 'SELLER', label: 'Seller' },
    { value: 'TEACHER', label: 'Teacher' },
  ];

  const handleRoleToggle = (role: RoleType) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
    // Clear errors for this role when toggled
    setErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[`${role}_doc`];
      delete newErrors[`${role}_text`];
      return newErrors;
    });
  };

  const handleFileUpload = (role: RoleType, file: File | null) => {
    if (file) {
      // Validate file
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({...prev, [`${role}_doc`]: 'Only images and PDFs are allowed'}));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({...prev, [`${role}_doc`]: 'File size must be less than 5MB'}));
        return;
      }

      setRoleDocuments(prev => ({...prev, [role]: file}));
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[`${role}_doc`];
        return newErrors;
      });
    } else {
      setRoleDocuments(prev => ({...prev, [role]: null}));
    }
  };

  const handleTextFieldChange = (role: RoleType, value: string) => {
    setRoleTextFields(prev => ({...prev, [role]: value}));
    if (value.trim()) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[`${role}_text`];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (selectedRoles.length === 0) {
      newErrors.roles = 'Please select at least one role';
    }

    selectedRoles.forEach(role => {
      switch(role) {
        case 'ARTIST':
          if (!roleTextFields.ARTIST?.trim()) {
            newErrors.ARTIST_text = 'Portfolio link is required';
          }
          if (!roleDocuments.ARTIST) {
            newErrors.ARTIST_doc = 'Sample work upload is required';
          }
          break;
        case 'ORGANIZER':
          if (!roleTextFields.ORGANIZER?.trim()) {
            newErrors.ORGANIZER_text = 'Past event reference is required';
          }
          if (!roleDocuments.ORGANIZER) {
            newErrors.ORGANIZER_doc = 'Approval letter is required';
          }
          break;
        case 'SELLER':
          if (!roleDocuments.SELLER) {
            newErrors.SELLER_doc = 'Business license or product proof is required';
          }
          break;
        case 'TEACHER':
          if (!roleDocuments.TEACHER) {
            newErrors.TEACHER_doc = 'Teaching certificate is required';
          }
          break;
      }
    });

    if (!reason.trim()) {
      newErrors.reason = 'Reason for role upgrade is required';
    }

    if (!contactInfo.trim()) {
      newErrors.contact = 'Contact information is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitRoleRequest = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formData = new FormData();
      formData.append('userId', profile?.id || '');
      formData.append('requestedRoles', JSON.stringify(selectedRoles));
      formData.append('reason', reason);
      formData.append('contact', contactInfo);

      // Add documents and text fields for each selected role
      selectedRoles.forEach(role => {
        if (roleDocuments[role]) {
          formData.append(`document_${role}`, roleDocuments[role]!);
        }
        if (roleTextFields[role]) {
          formData.append(`text_${role}`, roleTextFields[role]);
        }
      });

      // Get token from localStorage (stored during login)
      const token = localStorage.getItem('rasas_token');

      if (!token) {
        throw new Error('Please login again to submit a role request');
      }

      const response = await fetch('http://localhost:3001/api/role-requests/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit role request');
      }

      const data = await response.json();
      console.log('Success:', data);
      setSubmitStatus('success');
      
      // Clear form after 2 seconds
      setTimeout(() => {
        handleCloseModal();
        // Optionally refresh profile to show new status
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting role request:', error);
      setSubmitStatus('error');
      setErrors(prev => ({...prev, submit: error.message || 'Failed to submit request. Please try again.'}));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowRoleModal(false);
    // Reset form
    setTimeout(() => {
      setSelectedRoles([]);
      setRoleDocuments({});
      setRoleTextFields({});
      setReason('');
      setContactInfo('');
      setErrors({});
      setSubmitStatus('idle');
    }, 300);
  };

  const renderRoleSpecificFields = (role: RoleType) => {
    switch(role) {
      case 'ARTIST':
        return (
          <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Artist Requirements
            </h4>
            <div>
              <label className="block text-sm font-medium mb-2">Portfolio Link *</label>
              <input
                type="url"
                placeholder="https://your-portfolio.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={roleTextFields.ARTIST || ''}
                onChange={(e) => handleTextFieldChange('ARTIST', e.target.value)}
              />
              {errors.ARTIST_text && <p className="text-sm text-red-500 mt-1">{errors.ARTIST_text}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sample Work Upload *</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id="artist-file"
                  onChange={(e) => handleFileUpload('ARTIST', e.target.files?.[0] || null)}
                />
                <label 
                  htmlFor="artist-file"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5" />
                  {roleDocuments.ARTIST ? roleDocuments.ARTIST.name : 'Upload file (Image or PDF)'}
                </label>
              </div>
              {errors.ARTIST_doc && <p className="text-sm text-red-500 mt-1">{errors.ARTIST_doc}</p>}
            </div>
          </div>
        );
      
      case 'ORGANIZER':
        return (
          <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Organizer Requirements
            </h4>
            <div>
              <label className="block text-sm font-medium mb-2">Past Event Reference *</label>
              <input
                type="text"
                placeholder="Describe your past event organization experience"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={roleTextFields.ORGANIZER || ''}
                onChange={(e) => handleTextFieldChange('ORGANIZER', e.target.value)}
              />
              {errors.ORGANIZER_text && <p className="text-sm text-red-500 mt-1">{errors.ORGANIZER_text}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Approval Letter Upload *</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id="organizer-file"
                  onChange={(e) => handleFileUpload('ORGANIZER', e.target.files?.[0] || null)}
                />
                <label 
                  htmlFor="organizer-file"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5" />
                  {roleDocuments.ORGANIZER ? roleDocuments.ORGANIZER.name : 'Upload file (Image or PDF)'}
                </label>
              </div>
              {errors.ORGANIZER_doc && <p className="text-sm text-red-500 mt-1">{errors.ORGANIZER_doc}</p>}
            </div>
          </div>
        );

      case 'SELLER':
        return (
          <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Seller Requirements
            </h4>
            <div>
              <label className="block text-sm font-medium mb-2">Business License / Product Proof *</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id="seller-file"
                  onChange={(e) => handleFileUpload('SELLER', e.target.files?.[0] || null)}
                />
                <label 
                  htmlFor="seller-file"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5" />
                  {roleDocuments.SELLER ? roleDocuments.SELLER.name : 'Upload file (Image or PDF)'}
                </label>
              </div>
              {errors.SELLER_doc && <p className="text-sm text-red-500 mt-1">{errors.SELLER_doc}</p>}
            </div>
          </div>
        );

      case 'TEACHER':
        return (
          <div className="space-y-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Teacher Requirements
            </h4>
            <div>
              <label className="block text-sm font-medium mb-2">Teaching Certificate / Workshop Experience *</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id="teacher-file"
                  onChange={(e) => handleFileUpload('TEACHER', e.target.files?.[0] || null)}
                />
                <label 
                  htmlFor="teacher-file"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5" />
                  {roleDocuments.TEACHER ? roleDocuments.TEACHER.name : 'Upload file (Image or PDF)'}
                </label>
              </div>
              {errors.TEACHER_doc && <p className="text-sm text-red-500 mt-1">{errors.TEACHER_doc}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
            
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-zinc-800">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Role Upgrade</h3>
              <button
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-brand-200 dark:border-brand-900/50 text-brand-700 dark:text-brand-400 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all text-sm font-medium shadow-sm hover:shadow-md group"
                onClick={() => setShowRoleModal(true)}
              >
                <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Apply for Role Upgrade
              </button>
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

      {/* Role Upgrade Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-zinc-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Apply for Role Upgrade</h2>
                {selectedRoles.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {selectedRoles.map(role => (
                      <span 
                        key={role} 
                        className="px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-full"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 dark:text-green-300 font-medium">
                    Role upgrade request submitted successfully!
                  </p>
                </div>
              )}

              {submitStatus === 'error' && errors.submit && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 dark:text-red-300">{errors.submit}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Select Roles * <span className="text-slate-500 font-normal">(Select one or more)</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableRoles.map(role => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => handleRoleToggle(role.value)}
                        className={`p-4 rounded-xl border-2 transition-all text-center font-medium ${
                          selectedRoles.includes(role.value)
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                            : 'border-slate-200 dark:border-zinc-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                        }`}
                      >
                        {selectedRoles.includes(role.value) && (
                          <Check className="w-4 h-4 mx-auto mb-1" />
                        )}
                        {role.label}
                      </button>
                    ))}
                  </div>
                  {errors.roles && <p className="text-sm text-red-500 mt-2">{errors.roles}</p>}
                </div>

                {/* Role-Specific Fields */}
                {selectedRoles.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b border-slate-200 dark:border-zinc-800 pb-2">
                      Role-Specific Requirements
                    </h3>
                    {selectedRoles.map(role => (
                      <div key={role}>
                        {renderRoleSpecificFields(role)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Common Fields */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
                  <h3 className="font-semibold text-lg">General Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reason for Role Upgrade *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Explain why you want to upgrade your role..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                      value={reason}
                      onChange={(e) => {
                        setReason(e.target.value);
                        if (e.target.value.trim()) {
                          setErrors(prev => {
                            const newErrors = {...prev};
                            delete newErrors.reason;
                            return newErrors;
                          });
                        }
                      }}
                    />
                    {errors.reason && <p className="text-sm text-red-500 mt-1">{errors.reason}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contact Information *
                    </label>
                    <input
                      type="text"
                      placeholder="Email or phone number"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      value={contactInfo}
                      onChange={(e) => {
                        setContactInfo(e.target.value);
                        if (e.target.value.trim()) {
                          setErrors(prev => {
                            const newErrors = {...prev};
                            delete newErrors.contact;
                            return newErrors;
                          });
                        }
                      }}
                    />
                    {errors.contact && <p className="text-sm text-red-500 mt-1">{errors.contact}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRoleRequest}
                disabled={isSubmitting || submitStatus === 'success'}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white rounded-xl transition-colors font-medium flex items-center gap-2 shadow-lg shadow-violet-500/30"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <Check className="w-4 h-4" />
                    Submitted
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
