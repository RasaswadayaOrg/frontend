"use client";

import { User, MapPin, Bell, Heart, LogOut, X, Upload, Check, AlertCircle, Mail, Phone, Pencil, Sparkles, ChevronRight, Clock, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/app/actions/user";
import { fetchUserPreferences } from "@/app/actions/preferences";
import { updateUserPreferences } from "@/app/actions/updatePreferences";
import { CULTURAL_CATEGORIES, SRI_LANKAN_DISTRICTS, formatCityLabel, formatPreferenceLabel, normalizePreferenceId } from "@/lib/cultural-preferences";
import { getAuthToken } from "@/lib/token-storage";
import { updateUserProfile } from "@/app/actions/auth";
import { DesignStyles } from "@/components/hp2/design";
import { HP2Nav, DEFAULT_NAV_LINKS } from "@/components/hp2/Nav";
import { HP2Footer } from "@/components/hp2/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

type RoleType = "ARTIST" | "ORGANIZER" | "STORE_OWNER" | "TEACHER";

interface RoleDocuments { [key: string]: File | null; }
interface RoleTextFields { [key: string]: string; }

interface UserProfile {
  id?: string;
  email?: string | null;
  fullName?: string | null;
  phone?: string | null;
  city?: string | null;
  avatarUrl?: string | null;
}

interface UserPreferences {
  categories?: string[];
  interests?: string[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const { logout, refreshUser, user: authUser } = useAuth();
  const router = useRouter();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>([]);
  const [roleDocuments, setRoleDocuments] = useState<RoleDocuments>({});
  const [roleTextFields, setRoleTextFields] = useState<RoleTextFields>({});
  const [reason, setReason] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [whatsappInfo, setWhatsappInfo] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  type RoleRequestRecord = {
    id: string;
    requestedRole: RoleType | string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    rejectionReason?: string | null;
    requestedAt?: string;
    reviewedAt?: string | null;
  };
  const [roleRequests, setRoleRequests] = useState<RoleRequestRecord[]>([]);
  const [roleRequestsLoading, setRoleRequestsLoading] = useState(true);

  const fetchMyRoleRequests = async () => {
    try {
      const token = getAuthToken();
      if (!token) { setRoleRequestsLoading(false); return; }
      const res = await fetch(API_URL + "/v1/role-requests/my-requests", {
        headers: { Authorization: "Bearer " + token },
        cache: "no-store",
      });
      if (!res.ok) { setRoleRequestsLoading(false); return; }
      const json = await res.json();
      setRoleRequests(Array.isArray(json?.data) ? json.data : []);
    } catch {
      // silent — UI just shows the apply CTA when nothing returned
    } finally {
      setRoleRequestsLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchCurrentUser(), fetchUserPreferences()])
      .then(([profileData, prefs]) => {
        setProfile(profileData);
        setPreferences(prefs);
        setSelectedInterests(prefs?.interests || []);
        setSelectedCategories(prefs?.categories || []);
        setSelectedCity(normalizePreferenceId(profileData?.city));
        setLoading(false);
      })
      .catch(() => setLoading(false));
    fetchMyRoleRequests();
  }, []);

  const allInterests = CULTURAL_CATEGORIES.flatMap((c) => c.examples);
  const allCategories = CULTURAL_CATEGORIES;

  // When editing, only show interests that belong to the currently-selected
  // categories. If no categories are selected yet, show nothing (prompt first).
  const filteredInterests = selectedCategories.length > 0
    ? CULTURAL_CATEGORIES
        .filter((c) => selectedCategories.includes(c.id))
        .flatMap((c) => c.examples)
    : [];

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true);
    // Optimistic local preview
    const preview = URL.createObjectURL(file);
    setLocalAvatarUrl(preview);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");
      const form = new FormData();
      form.append("avatar", file);
      const res = await fetch(`${API_URL}/auth/avatar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || json?.error || "Upload failed");
      const newUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001"}${json.data.avatarUrl}`;
      setLocalAvatarUrl(newUrl);
      // Update localStorage + AuthContext
      const stored = localStorage.getItem("rasas_user");
      if (stored) {
        const u = JSON.parse(stored);
        u.avatarUrl = newUrl;
        localStorage.setItem("rasas_user", JSON.stringify(u));
        refreshUser();
      }
      setProfile((p) => p ? { ...p, avatarUrl: newUrl } : p);
    } catch (e: any) {
      console.error("Avatar upload failed:", e);
      // Revert preview on failure
      setLocalAvatarUrl(null);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category];
      // Remove interests that no longer belong to any selected category
      const allowedIds = new Set(
        CULTURAL_CATEGORIES.filter((c) => next.includes(c.id)).flatMap((c) => c.examples.map((e) => e.id))
      );
      setSelectedInterests((si) => si.filter((id) => allowedIds.has(id)));
      return next;
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCity(e.target.value);

  const handleSaveAll = async () => {
    const savePromises: Promise<any>[] = [
      updateUserPreferences({ categories: selectedCategories, interests: selectedInterests, city: selectedCity || undefined }),
    ];
    // Only call updateUserProfile if name or phone changed
    const nameChanged = editName.trim() && editName.trim() !== (profile?.fullName || "");
    const phoneChanged = editPhone.trim() !== (profile?.phone || "");
    if (nameChanged || phoneChanged) {
      const patch: Record<string, string> = {};
      if (nameChanged) patch.fullName = editName.trim();
      if (phoneChanged) patch.phone = editPhone.trim();
      savePromises.push(updateUserProfile(patch));
    }
    await Promise.all(savePromises);
    const [updated, prefs] = await Promise.all([fetchCurrentUser(), fetchUserPreferences()]);
    setProfile(updated);
    setPreferences(prefs);
    setSelectedInterests(prefs?.interests || []);
    setSelectedCategories(prefs?.categories || []);
    setSelectedCity(normalizePreferenceId(updated?.city));
    // Remove interests that no longer belong to any saved category
    const allowedIds = new Set(
      CULTURAL_CATEGORIES
        .filter((c) => (prefs?.categories || []).includes(c.id))
        .flatMap((c) => c.examples.map((e) => e.id))
    );
    setSelectedInterests((prev) => prev.filter((id) => allowedIds.has(id)));
    // Sync localStorage name if changed
    const stored = localStorage.getItem("rasas_user");
    if (stored && updated?.fullName) {
      const u = JSON.parse(stored);
      u.name = updated.fullName;
      localStorage.setItem("rasas_user", JSON.stringify(u));
      refreshUser();
    }
    // Bust cached server-component pages (homepage AI section, /events, etc.)
    // so freshly saved preferences are reflected on next navigation.
    try { router.refresh(); } catch { /* no-op */ }
    setEditing(false);
  };

  const handleCancelAll = () => {
    setSelectedCity(normalizePreferenceId(profile?.city));
    setSelectedInterests(preferences?.interests || []);
    setSelectedCategories(preferences?.categories || []);
    setEditing(false);
  };

  const handleLogout = () => { logout(); router.push("/"); };

  const availableRoles: { value: RoleType; label: string }[] = [
    { value: "ARTIST", label: "Artist" },
    { value: "ORGANIZER", label: "Organizer" },
    { value: "STORE_OWNER", label: "Seller" },
    { value: "TEACHER", label: "Teacher" },
  ];

  const handleRoleToggle = (role: RoleType) => {
    setSelectedRoles((prev) => prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]);
    setErrors((prev) => { const n = { ...prev }; delete n[role + "_doc"]; delete n[role + "_text"]; return n; });
  };

  const handleFileUpload = (role: RoleType, file: File | null) => {
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
      if (!validTypes.includes(file.type)) { setErrors((prev) => ({ ...prev, [role + "_doc"]: "Only images and PDFs are allowed" })); return; }
      if (file.size > 5 * 1024 * 1024) { setErrors((prev) => ({ ...prev, [role + "_doc"]: "File size must be less than 5MB" })); return; }
      setRoleDocuments((prev) => ({ ...prev, [role]: file }));
      setErrors((prev) => { const n = { ...prev }; delete n[role + "_doc"]; return n; });
    } else {
      setRoleDocuments((prev) => ({ ...prev, [role]: null }));
    }
  };

  const handleTextFieldChange = (role: RoleType, value: string) => {
    setRoleTextFields((prev) => ({ ...prev, [role]: value }));
    if (value.trim()) setErrors((prev) => { const n = { ...prev }; delete n[role + "_text"]; return n; });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (selectedRoles.length === 0) newErrors.roles = "Please select at least one role";
    selectedRoles.forEach((role) => {
      switch (role) {
        case "ARTIST":
          if (!roleTextFields.ARTIST?.trim()) newErrors.ARTIST_text = "Portfolio link is required";
          if (!roleDocuments.ARTIST) newErrors.ARTIST_doc = "Sample work upload is required";
          break;
        case "ORGANIZER":
          if (!roleTextFields.ORGANIZER?.trim()) newErrors.ORGANIZER_text = "Past event reference is required";
          if (!roleDocuments.ORGANIZER) newErrors.ORGANIZER_doc = "Approval letter is required";
          break;
        case "STORE_OWNER":
          if (!roleDocuments.STORE_OWNER) newErrors.STORE_OWNER_doc = "Business license or product proof is required";
          break;
        case "TEACHER":
          if (!roleDocuments.TEACHER) newErrors.TEACHER_doc = "Teaching certificate is required";
          break;
      }
    });
    if (!reason.trim()) newErrors.reason = "Reason for role upgrade is required";
    if (!contactInfo.trim()) newErrors.contact = "Contact information is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitRoleRequest = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const formData = new FormData();
      formData.append("userId", profile?.id || "");
      formData.append("requestedRoles", JSON.stringify(selectedRoles));
      formData.append("reason", reason);
      formData.append("contact", contactInfo);
      if (whatsappInfo.trim()) formData.append("whatsapp", whatsappInfo);
      selectedRoles.forEach((role) => {
        if (roleDocuments[role]) formData.append("document_" + role, roleDocuments[role]!);
        if (roleTextFields[role]) formData.append("text_" + role, roleTextFields[role]);
      });
      const token = getAuthToken();
      if (!token) throw new Error("Please login again to submit a role request");
      const response = await fetch(API_URL + "/v1/role-requests/apply", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      });
      if (!response.ok) { const d = await response.json(); throw new Error(d.error || "Failed to submit role request"); }
      setSubmitStatus("success");
      // Optimistically refresh the user's request list so the modal closes into
      // a "Processing" status panel without needing a full page reload.
      fetchMyRoleRequests();
      setTimeout(() => { handleCloseModal(); }, 1500);
    } catch (error: unknown) {
      setSubmitStatus("error");
      const message = error instanceof Error ? error.message : "Failed to submit request. Please try again.";
      setErrors((prev) => ({ ...prev, submit: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowRoleModal(false);
    setTimeout(() => {
      setSelectedRoles([]); setRoleDocuments({}); setRoleTextFields({});
      setReason(""); setContactInfo(""); setWhatsappInfo(""); setErrors({}); setSubmitStatus("idle");
    }, 300);
  };

  const renderRoleFields = (role: RoleType) => {
    const ROLE_COLORS: Record<RoleType, string> = {
      ARTIST: "#A78BFA", ORGANIZER: "#fbbf24", STORE_OWNER: "#60a5fa", TEACHER: "#34d399",
    };
    const COLOR = ROLE_COLORS[role];
    const LABELS: Record<RoleType, { title: string; textLabel?: string; textPlaceholder?: string; fileLabel: string }> = {
      ARTIST:      { title: "Artist Requirements",     textLabel: "Portfolio Link *",                  textPlaceholder: "https://your-portfolio.com",                            fileLabel: "Sample Work Upload *" },
      ORGANIZER:   { title: "Organizer Requirements",  textLabel: "Past Event Reference *",            textPlaceholder: "Describe your past event organization experience",       fileLabel: "Approval Letter Upload *" },
      STORE_OWNER: { title: "Seller Requirements",                                                                                                                                fileLabel: "Business License / Product Proof *" },
      TEACHER:     { title: "Teacher Requirements",                                                                                                                               fileLabel: "Teaching Certificate / Workshop Experience *" },
    };
    const conf = LABELS[role];
    const fileId = role.toLowerCase() + "-file";
    return (
      <div key={role} style={{ padding: "16px 20px", borderRadius: 16, border: "1px solid", borderColor: COLOR + "33", background: COLOR + "0a", display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 600, fontSize: 15, color: COLOR }}>{conf.title}</p>
        {conf.textLabel && (
          <div className="hp2-field">
            <label className="hp2-label">{conf.textLabel}</label>
            <input type="text" placeholder={conf.textPlaceholder} className="hp2-input" value={roleTextFields[role] || ""} onChange={(e) => handleTextFieldChange(role, e.target.value)} />
            {errors[role + "_text"] && <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>{errors[role + "_text"]}</p>}
          </div>
        )}
        <div className="hp2-field">
          <label className="hp2-label">{conf.fileLabel}</label>
          <input type="file" accept="image/*,.pdf" className="hp2-upload" id={fileId} onChange={(e) => handleFileUpload(role, e.target.files?.[0] || null)} />
          <label htmlFor={fileId} className="hp2-upload__label">
            <Upload size={16} />
            {roleDocuments[role] ? roleDocuments[role]!.name : "Upload file (Image or PDF, max 5MB)"}
          </label>
          {errors[role + "_doc"] && <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>{errors[role + "_doc"]}</p>}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <main className="hp2">
        <DesignStyles />
        <HP2Nav links={DEFAULT_NAV_LINKS} activePath="/profile" />
        <div className="hp2-loading" style={{ minHeight: "60vh" }}><div className="hp2-spinner hp2-spinner--lg" /></div>
        <HP2Footer />
      </main>
    );
  }

  return (
    <main className="hp2">
      <DesignStyles />
      <HP2Nav links={DEFAULT_NAV_LINKS} activePath="/profile" />

      <section style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div
          className="hp2-container"
          style={{ maxWidth: 880, display: "flex", flexDirection: "column", gap: 28 }}
        >
          {/* ── Page kicker ───────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9B95B5", fontWeight: 600, marginBottom: 6 }}>
                Account
              </p>
              <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: 26, fontWeight: 600, color: "#F5F3FA", letterSpacing: "-0.01em", margin: 0 }}>
                My profile
              </h1>
            </div>
            {!editing ? (
              <button
                type="button"
                className="hp2-btn hp2-btn--ghost hp2-btn--sm"
                onClick={() => {
                  setSelectedCity(normalizePreferenceId(profile?.city));
                  setSelectedInterests(preferences?.interests || []);
                  setSelectedCategories(preferences?.categories || []);
                  setEditName(profile?.fullName || "");
                  setEditPhone(profile?.phone || "");
                  setEditing(true);
                }}
              >
                <Pencil size={13} /><span style={{ marginLeft: 6 }}>Edit</span>
              </button>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" className="hp2-btn hp2-btn--ghost hp2-btn--sm" onClick={handleCancelAll}>Cancel</button>
                <button type="button" className="hp2-btn hp2-btn--primary hp2-btn--sm" onClick={handleSaveAll}>
                  <Check size={13} /><span style={{ marginLeft: 6 }}>Save changes</span>
                </button>
              </div>
            )}
          </div>

          {/* ── Identity card ─────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "24px 28px",
              borderRadius: 20,
              background: "#15121D",
              border: "1px solid rgba(196,181,253,0.10)",
            }}
          >
            {/* Avatar */}
            <label
              htmlFor={editing ? "avatar-upload" : undefined}
              style={{
                position: "relative",
                width: 72,
                height: 72,
                borderRadius: "50%",
                flexShrink: 0,
                cursor: editing ? "pointer" : "default",
                display: "block",
              }}
              title={editing ? "Change photo" : undefined}
            >
              {(localAvatarUrl || profile?.avatarUrl || authUser?.avatarUrl) ? (
                <img
                  src={localAvatarUrl || profile?.avatarUrl || authUser?.avatarUrl || ""}
                  alt="Profile photo"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid rgba(196,181,253,0.18)",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2a2138 0%, #15121D 100%)",
                    border: "1px solid rgba(196,181,253,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#C4B5FD",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 26,
                    fontWeight: 600,
                  }}
                >
                  {(profile?.fullName || profile?.email || "?").charAt(0).toUpperCase()}
                </div>
              )}
              {editing && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.55)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    color: "#fff",
                  }}
                >
                  {avatarUploading ? (
                    <span style={{ fontSize: 10, color: "#C4B5FD" }}>Uploading…</span>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span style={{ fontSize: 9, letterSpacing: "0.04em" }}>CHANGE</span>
                    </>
                  )}
                </div>
              )}
            </label>
            {editing && (
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                  e.target.value = "";
                }}
              />
            )}

            {/* Name + email */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {editing ? (
                <input
                  className="hp2-input"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your full name"
                  style={{ height: 40, fontSize: 16, fontWeight: 600, marginBottom: 6, maxWidth: 320 }}
                  aria-label="Full name"
                />
              ) : (
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#F5F3FA",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {profile?.fullName || "Add your name"}
                </p>
              )}

            </div>
          </div>


          {/* ── Personal information ──────────────────── */}
          <SectionCard
            title="Personal information"
            description="How we contact you and where we tailor recommendations."
          >
            <InfoRow icon={<Mail size={14} />} label="Email" value={profile?.email || "—"} />
            <Divider />
            {editing ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#9B95B5", flexShrink: 0, minWidth: 130 }}>
                  <Phone size={14} />
                  <span style={{ fontSize: 13 }}>Phone</span>
                </div>
                <input
                  className="hp2-input"
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+94 77 000 0000"
                  style={{ height: 40, maxWidth: 320 }}
                  aria-label="Phone number"
                />
              </div>
            ) : (
              <InfoRow icon={<Phone size={14} />} label="Phone" value={profile?.phone || "Not added"} muted={!profile?.phone} />
            )}
            <Divider />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#9B95B5", flexShrink: 0, minWidth: 130 }}>
                <MapPin size={14} />
                <span style={{ fontSize: 13 }}>City</span>
              </div>
              {editing ? (
                <select
                  className="hp2-input"
                  value={selectedCity}
                  onChange={handleLocationChange}
                  style={{ height: 40, maxWidth: 320 }}
                  aria-label="Select city"
                >
                  <option value="">Select your city</option>
                  {SRI_LANKAN_DISTRICTS.map((city) => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              ) : (
                <span style={{ fontSize: 14, color: profile?.city ? "#F5F3FA" : "#6B6587", textAlign: "right" }}>
                  {profile?.city ? formatCityLabel(profile.city) : "Not set"}
                </span>
              )}
            </div>
          </SectionCard>

          {/* ── Preferred categories (FIRST) ──────────── */}
          <SectionCard
            title="Preferred categories"
            description="Choose the art forms you care about — this shapes everything else."
          >
            {!editing ? (
              preferences?.categories?.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {preferences.categories.map((category: string) => (
                    <span key={category} className="hp2-preference-chip is-selected">
                      {formatPreferenceLabel(category)}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyHint>No categories yet — tap Edit to choose.</EmptyHint>
              )
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {allCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={"hp2-preference-chip" + (selectedCategories.includes(category.id) ? " is-selected" : "")}
                    onClick={() => handleCategoryToggle(category.id)}
                    aria-pressed={selectedCategories.includes(category.id)}
                  >
                    {category.shortName}
                  </button>
                ))}
              </div>
            )}
          </SectionCard>

          {/* ── Cultural interests (filtered by categories) ── */}
          <SectionCard
            title="Cultural interests"
            description="Specific art forms within your chosen categories."
          >
            {!editing ? (
              preferences?.interests?.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {preferences.interests.map((interest: string) => (
                    <span key={interest} className="hp2-preference-chip is-selected">
                      {formatPreferenceLabel(interest)}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyHint>No interests yet — tap Edit to choose.</EmptyHint>
              )
            ) : filteredInterests.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {filteredInterests.map((interest) => (
                  <button
                    key={interest.id}
                    type="button"
                    className={"hp2-preference-chip" + (selectedInterests.includes(interest.id) ? " is-selected" : "")}
                    onClick={() => handleInterestToggle(interest.id)}
                    aria-pressed={selectedInterests.includes(interest.id)}
                  >
                    {interest.name.replace(/\s*\([^)]*\)/g, "")}
                  </button>
                ))}
              </div>
            ) : (
              <EmptyHint>Select a category above to see related interests.</EmptyHint>
            )}
          </SectionCard>


          {/* ── Reminders ─────────────────────────────── */}
          <SectionCard
            title="Upcoming reminders"
            description="Events you've saved or RSVPed will appear here."
            icon={<Bell size={14} />}
          >
            <EmptyHint>No upcoming reminders.</EmptyHint>
          </SectionCard>

          {/* ── Role-upgrade status ───────────────────── */}
          {!roleRequestsLoading && roleRequests.length > 0 && (
            <SectionCard
              title="Role upgrade status"
              description="Track the progress of your role applications."
              icon={<Sparkles size={14} />}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {roleRequests.map((req) => <RoleRequestStatusRow key={req.id} req={req} />)}
              </div>
            </SectionCard>
          )}

          {/* ── Account actions ───────────────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderRadius: 20,
              background: "#15121D",
              border: "1px solid rgba(196,181,253,0.10)",
              overflow: "hidden",
            }}
          >
            <ActionRow
              icon={<Sparkles size={15} style={{ color: "#A78BFA" }} />}
              title={roleRequests.some((r) => r.status === "PENDING") ? "Apply for another role" : "Apply for role upgrade"}
              subtitle={roleRequests.some((r) => r.status === "PENDING") ? "You can apply for additional roles while one is in review." : "Become an artist, organizer, seller or teacher."}
              onClick={() => setShowRoleModal(true)}
            />
            <Divider noPad />
            <ActionRow
              icon={<LogOut size={15} style={{ color: "#FCA5A5" }} />}
              title="Sign out"
              subtitle="End your session on this device."
              danger
              onClick={handleLogout}
            />
          </div>
        </div>
      </section>

      {/* Role Upgrade Modal */}
      {showRoleModal && (
        <div className="hp2-modal-bg" role="dialog" aria-modal="true" aria-label="Apply for role upgrade">
          <div className="hp2-modal" style={{ maxWidth: 680, maxHeight: "90vh" }}>
            {/* Head */}
            <div className="hp2-modal__head">
              <div>
                <span className="hp2-modal__title">Apply for Role Upgrade</span>
                {selectedRoles.length > 0 && (
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    {selectedRoles.map((role) => (
                      <span key={role} className="hp2-badge hp2-badge--processing" style={{ fontSize: 11 }}>{role}</span>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" className="hp2-modal__close" onClick={handleCloseModal} aria-label="Close"><X size={18} /></button>
            </div>

            {/* Body */}
            <div className="hp2-modal__body">
              {submitStatus === "success" && (
                <div className="hp2-alert hp2-alert--success" style={{ marginBottom: 20 }}>
                  <Check size={14} />
                  Role upgrade request submitted successfully!
                </div>
              )}
              {submitStatus === "error" && errors.submit && (
                <div className="hp2-alert hp2-alert--error" style={{ marginBottom: 20 }}>
                  <AlertCircle size={14} />
                  {errors.submit}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {/* Role selection */}
                <div>
                  <p className="hp2-label" style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                    Select Roles * <span style={{ color: "#9B95B5", fontWeight: 400 }}>(Select one or more)</span>
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                    {availableRoles.map((role) => (
                      <button key={role.value} type="button"
                        onClick={() => handleRoleToggle(role.value)}
                        style={{
                          padding: "14px 16px", borderRadius: 14, border: "2px solid",
                          borderColor: selectedRoles.includes(role.value) ? "#A78BFA" : "rgba(196,181,253,0.15)",
                          background: selectedRoles.includes(role.value) ? "rgba(167,139,250,0.12)" : "#1E1A2B",
                          color: selectedRoles.includes(role.value) ? "#C4B5FD" : "#F5F3FA",
                          fontFamily: "var(--font-outfit)", fontWeight: 500, fontSize: 14, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                          transition: "all .2s ease",
                        }}
                        aria-pressed={selectedRoles.includes(role.value)}
                      >
                        {selectedRoles.includes(role.value) && <Check size={14} />}
                        {role.label}
                      </button>
                    ))}
                  </div>
                  {errors.roles && <p style={{ fontSize: 12, color: "#f87171", marginTop: 6 }}>{errors.roles}</p>}
                </div>

                {/* Role-specific fields */}
                {selectedRoles.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "#F5F3FA", paddingBottom: 10, borderBottom: "1px solid rgba(196,181,253,0.10)" }}>
                      Role-Specific Requirements
                    </p>
                    {selectedRoles.map((role) => renderRoleFields(role))}
                  </div>
                )}

                {/* General fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 14, borderTop: "1px solid rgba(196,181,253,0.10)" }}>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "#F5F3FA" }}>General Information</p>

                  <div className="hp2-field">
                    <label className="hp2-label" htmlFor="role-reason">Reason for Role Upgrade *</label>
                    <textarea
                      id="role-reason"
                      rows={4}
                      className="hp2-textarea"
                      placeholder="Explain why you want to upgrade your role…"
                      value={reason}
                      onChange={(e) => {
                        setReason(e.target.value);
                        if (e.target.value.trim()) setErrors((prev) => { const n = { ...prev }; delete n.reason; return n; });
                      }}
                    />
                    {errors.reason && <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>{errors.reason}</p>}
                  </div>

                  <div className="hp2-field">
                    <label className="hp2-label" htmlFor="role-contact">Contact Number *</label>
                    <input
                      id="role-contact"
                      type="text"
                      className="hp2-input"
                      placeholder="+94 11 223 6767"
                      value={contactInfo}
                      onChange={(e) => {
                        setContactInfo(e.target.value);
                        if (e.target.value.trim()) setErrors((prev) => { const n = { ...prev }; delete n.contact; return n; });
                      }}
                    />
                    {errors.contact && <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>{errors.contact}</p>}
                  </div>

                  <div className="hp2-field">
                    <label className="hp2-label" htmlFor="role-whatsapp">WhatsApp Number</label>
                    <input
                      id="role-whatsapp"
                      type="tel"
                      className="hp2-input"
                      placeholder="+94 77 223 6767 (can be same or different)"
                      value={whatsappInfo}
                      onChange={(e) => setWhatsappInfo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="hp2-modal__foot">
              <button type="button" className="hp2-btn hp2-btn--ghost" onClick={handleCloseModal} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="button" className="hp2-btn hp2-btn--primary"
                onClick={handleSubmitRoleRequest}
                disabled={isSubmitting || submitStatus === "success"}>
                {isSubmitting ? (
                  <><span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(10,10,11,0.3)", borderTopColor: "#0a0a0b", animation: "hp2-spin .8s linear infinite", display: "inline-block", marginRight: 8 }} />Submitting…</>
                ) : submitStatus === "success" ? (
                  <><Check size={14} style={{ marginRight: 6 }} />Submitted</>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <HP2Footer />
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Small layout helpers — kept local to this page for readability.
 * ──────────────────────────────────────────────────────────────────────── */

function SectionCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#15121D",
        border: "1px solid rgba(196,181,253,0.10)",
        borderRadius: 20,
        padding: "22px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div>
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-outfit)",
            fontSize: 15,
            fontWeight: 600,
            color: "#F5F3FA",
            margin: 0,
          }}
        >
          {icon ? <span style={{ color: "#A78BFA", display: "inline-flex" }}>{icon}</span> : null}
          {title}
        </p>
        {description ? (
          <p style={{ fontSize: 13, color: "#9B95B5", marginTop: 4, lineHeight: 1.5 }}>{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  muted,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#9B95B5", flexShrink: 0, minWidth: 130 }}>
        {icon}
        <span style={{ fontSize: 13 }}>{label}</span>
      </div>
      <span
        style={{
          fontSize: 14,
          color: muted ? "#6B6587" : "#F5F3FA",
          textAlign: "right",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Divider({ noPad }: { noPad?: boolean }) {
  return (
    <div
      style={{
        height: 1,
        background: "rgba(196,181,253,0.08)",
        margin: noPad ? 0 : "0",
      }}
    />
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, color: "#6B6587", margin: 0 }}>{children}</p>;
}

function ActionRow({
  icon,
  title,
  subtitle,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "18px 24px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        color: danger ? "#FCA5A5" : "#F5F3FA",
        transition: "background .15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(196,181,253,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "#1E1A2B",
          border: "1px solid rgba(196,181,253,0.10)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600 }}>{title}</span>
        {subtitle ? (
          <span style={{ display: "block", fontSize: 12, color: "#9B95B5", marginTop: 2 }}>{subtitle}</span>
        ) : null}
      </span>
      <ChevronRight size={16} style={{ color: "#6B6587", flexShrink: 0 }} />
    </button>
  );
}

const ROLE_LABELS: Record<string, string> = {
  ARTIST:      "Artist",
  ORGANIZER:   "Organizer",
  STORE_OWNER: "Seller",
  TEACHER:     "Teacher",
};

function RoleRequestStatusRow({ req }: { req: { id: string; requestedRole: string; status: "PENDING" | "APPROVED" | "REJECTED"; rejectionReason?: string | null; requestedAt?: string; reviewedAt?: string | null } }) {
  const isPending  = req.status === "PENDING";
  const isApproved = req.status === "APPROVED";
  const isRejected = req.status === "REJECTED";

  const tone =
    isApproved ? { fg: "#34D399", bg: "rgba(52,211,153,0.10)", border: "rgba(52,211,153,0.30)" } :
    isRejected ? { fg: "#FCA5A5", bg: "rgba(252,165,165,0.10)", border: "rgba(252,165,165,0.30)" } :
                 { fg: "#FBBF24", bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.30)" };

  const Icon = isApproved ? Check : isRejected ? XCircle : Clock;

  const headline =
    isApproved ? `You're now verified as ${ROLE_LABELS[req.requestedRole] || req.requestedRole}` :
    isRejected ? `Application not approved` :
                 `Processing your ${ROLE_LABELS[req.requestedRole] || req.requestedRole} application`;

  const sub =
    isApproved
      ? (req.reviewedAt ? `Approved on ${formatDate(req.reviewedAt)}` : "Welcome aboard.")
      : isRejected
      ? (req.rejectionReason ? req.rejectionReason : "Please review the requirements and re-apply.")
      : `Submitted ${req.requestedAt ? formatDate(req.requestedAt) : "just now"}. Our team usually reviews within 2–3 business days.`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 12,
        background: tone.bg,
        border: "1px solid " + tone.border,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(7,6,10,0.45)",
          color: tone.fg,
          flexShrink: 0,
          ...(isPending ? { animation: "rsq-pulse 1.6s ease-in-out infinite" } : {}),
        }}
      >
        <Icon size={16} strokeWidth={2} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 600, color: "#F5F3FA", letterSpacing: "-0.005em" }}>
            {headline}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: tone.fg, padding: "3px 8px", borderRadius: 999, border: "1px solid " + tone.border, background: "rgba(7,6,10,0.45)" }}>
            {req.status}
          </span>
        </div>
        <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.5, color: "#C4B0DA" }}>{sub}</p>
      </div>
      <style>{"@keyframes rsq-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }"}</style>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}
