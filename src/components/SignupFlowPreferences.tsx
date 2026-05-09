"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveUserPreferences, updateUserProfile } from "@/app/actions/auth";
import { CULTURAL_CATEGORIES, SRI_LANKAN_DISTRICTS, formatCityLabel } from "@/lib/cultural-preferences";
import { ArrowLeft, ArrowRight, Check, Film, MapPin, Music, PersonStanding, Theater, Sparkles } from "lucide-react";

const CATEGORY_UI: Record<string, { icon: React.ElementType; grad: string; glow: string }> = {
  music: { icon: Music,          grad: "linear-gradient(135deg,#f59e0b,#ea580c)", glow: "rgba(245,158,11,0.35)" },
  dance: { icon: PersonStanding, grad: "linear-gradient(135deg,#ec4899,#f43f5e)", glow: "rgba(236,72,153,0.35)" },
  film:  { icon: Film,           grad: "linear-gradient(135deg,#10b981,#0d9488)", glow: "rgba(16,185,129,0.35)" },
  drama: { icon: Theater,        grad: "linear-gradient(135deg,#6366f1,#4f46e5)", glow: "rgba(99,102,241,0.35)" },
};

const ONBOARD_CSS = `
.ob-wrap{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
  background:#07060A;background-image:
    radial-gradient(60% 80% at 18% 28%,rgba(167,139,250,.45),transparent 62%),
    radial-gradient(50% 70% at 82% 18%,rgba(240,166,248,.32),transparent 60%),
    radial-gradient(70% 90% at 60% 95%,rgba(124,58,237,.40),transparent 70%),
    linear-gradient(180deg,#1E1A2B 0%,#07060A 100%);}
.ob-card{width:100%;max-width:480px;background:rgba(21,18,29,0.78);border:1px solid rgba(196,181,253,0.13);
  border-radius:20px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  box-shadow:0 32px 80px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.06);}
.ob-head{padding:28px 28px 20px;border-bottom:1px solid rgba(196,181,253,0.08);}
.ob-logo{display:flex;align-items:center;gap:10px;margin-bottom:20px;}
.ob-logo-dot{width:32px;height:32px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;}
.ob-logo-mark{width:12px;height:12px;border-radius:50%;background:#07060a;}
.ob-logo-name{font-size:14px;font-weight:600;color:#F5F3FA;letter-spacing:-0.02em;}
.ob-title{font-size:20px;font-weight:700;color:#F5F3FA;letter-spacing:-0.03em;margin:0 0 4px;}
.ob-sub{font-size:13px;color:#9B95B5;margin:0;}
.ob-steps{display:flex;align-items:center;gap:0;padding:20px 28px;border-bottom:1px solid rgba(196,181,253,0.08);}
.ob-step{display:flex;align-items:center;gap:6px;font-size:12px;color:#9B95B5;}
.ob-step.active{color:#A78BFA;}
.ob-step.done{color:#10b981;}
.ob-step-num{width:24px;height:24px;border-radius:50%;border:1.5px solid rgba(196,181,253,0.18);
  display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;}
.ob-step.active .ob-step-num{background:rgba(167,139,250,0.2);border-color:#A78BFA;color:#A78BFA;}
.ob-step.done .ob-step-num{background:rgba(16,185,129,0.18);border-color:#10b981;color:#10b981;}
.ob-step-line{flex:1;height:1px;background:rgba(196,181,253,0.10);margin:0 6px;}
.ob-step-line.done{background:rgba(16,185,129,0.35);}
.ob-body{padding:24px 28px;}
.ob-icon-ring{width:56px;height:56px;border-radius:50%;background:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.2);
  display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
.ob-section-title{font-size:17px;font-weight:600;color:#F5F3FA;text-align:center;margin:0 0 4px;}
.ob-section-sub{font-size:13px;color:#9B95B5;text-align:center;margin:0 0 20px;}
.ob-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.ob-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}
.ob-chip{padding:10px 8px;border-radius:12px;border:1px solid rgba(196,181,253,0.12);background:rgba(255,255,255,0.03);
  color:#9B95B5;font-size:12px;font-weight:500;cursor:pointer;transition:all .18s ease;text-align:center;}
.ob-chip:hover{border-color:rgba(167,139,250,0.3);background:rgba(167,139,250,0.07);color:#C4B5FD;}
.ob-chip.sel{border-color:#A78BFA;background:rgba(167,139,250,0.14);color:#F5F3FA;}
.ob-cat-card{padding:16px 14px;border-radius:14px;border:1px solid rgba(196,181,253,0.10);background:rgba(255,255,255,0.02);
  cursor:pointer;transition:all .2s ease;position:relative;text-align:left;}
.ob-cat-card:hover{border-color:rgba(167,139,250,0.25);background:rgba(167,139,250,0.05);}
.ob-cat-card.sel{border-color:rgba(167,139,250,0.5);background:rgba(167,139,250,0.10);}
.ob-cat-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;}
.ob-cat-name{font-size:13px;font-weight:600;color:#F5F3FA;}
.ob-cat-check{position:absolute;top:10px;right:10px;width:18px;height:18px;border-radius:50%;
  background:#A78BFA;display:flex;align-items:center;justify-content:center;}
.ob-interest-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;
  border:1px solid rgba(196,181,253,0.10);background:rgba(255,255,255,0.02);cursor:pointer;transition:all .18s ease;}
.ob-interest-row:hover{border-color:rgba(167,139,250,0.25);background:rgba(167,139,250,0.06);}
.ob-interest-row.sel{border-color:rgba(167,139,250,0.45);background:rgba(167,139,250,0.10);}
.ob-interest-emoji{font-size:20px;line-height:1;flex-shrink:0;}
.ob-interest-name{font-size:13px;color:#C4B5FD;font-weight:500;flex:1;}
.ob-interest-check{width:16px;height:16px;border-radius:50%;background:#A78BFA;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ob-cat-label{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#9B95B5;margin:0 0 8px;}
.ob-scroll{max-height:300px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;}
.ob-scroll::-webkit-scrollbar{width:4px;}
.ob-scroll::-webkit-scrollbar-track{background:transparent;}
.ob-scroll::-webkit-scrollbar-thumb{background:rgba(167,139,250,0.25);border-radius:2px;}
.ob-btn{width:100%;padding:13px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s ease;margin-top:20px;}
.ob-btn-primary{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:none;
  box-shadow:0 4px 20px rgba(124,58,237,0.4);}
.ob-btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 28px rgba(124,58,237,0.55);}
.ob-btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.ob-back{background:none;border:none;color:#9B95B5;cursor:pointer;display:flex;align-items:center;gap:4px;font-size:13px;padding:0;margin-bottom:16px;}
.ob-back:hover{color:#C4B5FD;}
.ob-error{padding:12px 14px;border-radius:10px;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.08);
  color:#fca5a5;font-size:13px;margin-bottom:16px;}
.ob-success-ring{width:72px;height:72px;border-radius:50%;background:rgba(16,185,129,0.12);border:1.5px solid rgba(16,185,129,0.35);
  display:flex;align-items:center;justify-content:center;margin:0 auto 20px;}
.ob-spinner{width:20px;height:20px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:ob-spin .7s linear infinite;}
@keyframes ob-spin{to{transform:rotate(360deg);}}
`;


interface SignupFlowPreferencesProps {
  onComplete?: () => void;
}

type Step = "location" | "categories" | "examples" | "complete";

export function SignupFlowPreferences({ onComplete }: SignupFlowPreferencesProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("location");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedExamples, setSelectedExamples] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (id: string) =>
    setSelectedCategories((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const toggleExample = (id: string) =>
    setSelectedExamples((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const handleComplete = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const profileResult = await updateUserProfile({ city: selectedCity });
      if (!profileResult.success) throw new Error(profileResult.error || "Could not save location.");
      const prefsResult = await saveUserPreferences({ city: selectedCity, categories: selectedCategories, interests: selectedExamples });
      if (!prefsResult.success) throw new Error(prefsResult.error || "Could not save preferences.");
      setCurrentStep("complete");
      setTimeout(() => { onComplete?.(); router.push("/"); }, 2200);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepIndex = { location: 0, categories: 1, examples: 2, complete: 3 }[currentStep];

  const Steps = () => (
    <div className="ob-steps">
      {["Location", "Interests", "Preferences"].map((label, i) => (
        <div key={label} style={{ display: "contents" }}>
          <div className={`ob-step ${i < stepIndex ? "done" : i === stepIndex ? "active" : ""}`}>
            <span className="ob-step-num">
              {i < stepIndex ? <Check size={12} /> : i + 1}
            </span>
            <span>{label}</span>
          </div>
          {i < 2 && <div className={`ob-step-line ${i < stepIndex ? "done" : ""}`} />}
        </div>
      ))}
    </div>
  );

  // ── Step 1: Location ──
  if (currentStep === "location") return (
    <div className="ob-wrap">
      <style dangerouslySetInnerHTML={{ __html: ONBOARD_CSS }} />
      <div className="ob-card">
        <div className="ob-head">
          <div className="ob-logo">
            <div className="ob-logo-dot"><div className="ob-logo-mark" /></div>
            <span className="ob-logo-name">Rasaswadaya</span>
          </div>
          <h1 className="ob-title">Set up your profile</h1>
          <p className="ob-sub">Personalise your experience in 3 quick steps</p>
        </div>
        <Steps />
        <div className="ob-body">
          <div className="ob-icon-ring">
            <MapPin size={24} color="#A78BFA" />
          </div>
          <p className="ob-section-title">Where are you based?</p>
          <p className="ob-section-sub">We'll show you cultural events closest to you</p>
          {error && <div className="ob-error">{error}</div>}
          <div className="ob-grid-3" style={{ maxHeight: 280, overflowY: "auto" }}>
            {SRI_LANKAN_DISTRICTS.map((d) => (
              <button key={d.id} className={`ob-chip ${selectedCity === d.id ? "sel" : ""}`}
                onClick={() => setSelectedCity(d.id)}>
                {d.name}
              </button>
            ))}
          </div>
          <button className="ob-btn ob-btn-primary" disabled={!selectedCity}
            onClick={() => setCurrentStep("categories")}>
            Continue <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // ── Step 2: Categories ──
  if (currentStep === "categories") return (
    <div className="ob-wrap">
      <style dangerouslySetInnerHTML={{ __html: ONBOARD_CSS }} />
      <div className="ob-card">
        <div className="ob-head">
          <div className="ob-logo">
            <div className="ob-logo-dot"><div className="ob-logo-mark" /></div>
            <span className="ob-logo-name">Rasaswadaya</span>
          </div>
          <h1 className="ob-title">What moves you?</h1>
          <p className="ob-sub">Pick the art forms you love</p>
        </div>
        <Steps />
        <div className="ob-body">
          <button className="ob-back" onClick={() => setCurrentStep("location")}>
            <ArrowLeft size={14} /> Back
          </button>
          <p className="ob-section-title">Choose your interests</p>
          <p className="ob-section-sub">Select all that resonate with you</p>
          <div className="ob-grid-2">
            {CULTURAL_CATEGORIES.map((cat) => {
              const { icon: Icon, grad, glow } = CATEGORY_UI[cat.id] ?? CATEGORY_UI.music;
              const sel = selectedCategories.includes(cat.id);
              return (
                <button key={cat.id} className={`ob-cat-card ${sel ? "sel" : ""}`}
                  onClick={() => toggleCategory(cat.id)}>
                  <div className="ob-cat-icon"
                    style={{ background: grad, boxShadow: sel ? `0 4px 16px ${glow}` : "none" }}>
                    <Icon size={20} color="#fff" />
                  </div>
                  <div className="ob-cat-name">{cat.name}</div>
                  {sel && (
                    <div className="ob-cat-check">
                      <Check size={10} color="#fff" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <button className="ob-btn ob-btn-primary" disabled={selectedCategories.length === 0}
            onClick={() => setCurrentStep("examples")}>
            Continue <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // ── Step 3: Specific preferences ──
  if (currentStep === "examples") {
    const selectedCats = CULTURAL_CATEGORIES.filter((c) => selectedCategories.includes(c.id));
    return (
      <div className="ob-wrap">
        <style dangerouslySetInnerHTML={{ __html: ONBOARD_CSS }} />
        <div className="ob-card">
          <div className="ob-head">
            <div className="ob-logo">
              <div className="ob-logo-dot"><div className="ob-logo-mark" /></div>
              <span className="ob-logo-name">Rasaswadaya</span>
            </div>
            <h1 className="ob-title">Fine-tune your taste</h1>
            <p className="ob-sub">Pick specific styles for better AI recommendations</p>
          </div>
          <Steps />
          <div className="ob-body">
            <button className="ob-back" onClick={() => setCurrentStep("categories")}>
              <ArrowLeft size={14} /> Back
            </button>
            {error && <div className="ob-error">{error}</div>}
            <div className="ob-scroll">
              {selectedCats.map((cat) => (
                <div key={cat.id} style={{ marginBottom: 16 }}>
                  <p className="ob-cat-label">{cat.name}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {cat.examples.map((ex) => {
                      const sel = selectedExamples.includes(ex.id);
                      return (
                        <button key={ex.id} className={`ob-interest-row ${sel ? "sel" : ""}`}
                          onClick={() => toggleExample(ex.id)}>
                          <span className="ob-interest-emoji">{ex.image}</span>
                          <span className="ob-interest-name">{ex.name}</span>
                          {sel && <div className="ob-interest-check"><Check size={9} color="#fff" /></div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button className="ob-btn ob-btn-primary" disabled={isSubmitting} onClick={handleComplete}>
              {isSubmitting
                ? <><div className="ob-spinner" /> Saving…</>
                : <><Sparkles size={16} /> Complete setup</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 4: Done ──
  return (
    <div className="ob-wrap">
      <style dangerouslySetInnerHTML={{ __html: ONBOARD_CSS }} />
      <div className="ob-card">
        <div className="ob-body" style={{ padding: "48px 28px", textAlign: "center" }}>
          <div className="ob-success-ring">
            <Check size={32} color="#10b981" />
          </div>
          <h2 className="ob-title" style={{ textAlign: "center", fontSize: 22 }}>You're all set!</h2>
          <p className="ob-sub" style={{ marginTop: 8, marginBottom: 20 }}>
            Discovering cultural events near {formatCityLabel(selectedCity)} for you…
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {selectedCategories.map((cid) => {
              const cat = CULTURAL_CATEGORIES.find((c) => c.id === cid);
              return cat ? (
                <span key={cid} style={{
                  padding: "4px 14px", borderRadius: 999,
                  background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)",
                  color: "#C4B5FD", fontSize: 12, fontWeight: 600,
                }}>{cat.name}</span>
              ) : null;
            })}
          </div>
          <p style={{ fontSize: 12, color: "#9B95B5", marginTop: 24 }}>Redirecting to home…</p>
        </div>
      </div>
    </div>
  );
}


