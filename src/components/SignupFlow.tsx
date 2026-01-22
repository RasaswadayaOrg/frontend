"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { saveUserPreferences, registerUser, updateUserProfile } from "@/app/actions/auth";
import { ArrowLeft, ArrowRight, Check, MapPin, Music, Theater, Palette, BookOpen, Mic2, Camera } from "lucide-react";

// Sri Lankan cities
const SRI_LANKAN_CITIES = [
  "Colombo",
  "Kandy",
  "Galle",
  "Jaffna",
  "Negombo",
  "Anuradhapura",
  "Trincomalee",
  "Batticaloa",
  "Matara",
  "Kurunegala",
  "Ratnapura",
  "Badulla",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Hambantota",
];

// Cultural event categories with examples
const CULTURAL_CATEGORIES = [
  {
    id: "traditional-music",
    name: "Traditional Music",
    icon: Music,
    color: "from-amber-500 to-orange-500",
    examples: [
      { id: "kandyan-drums", name: "Kandyan Drums", image: "🥁" },
      { id: "baila", name: "Baila & Kaffrinha", image: "🎺" },
      { id: "nadagam", name: "Nadagam Songs", image: "🎵" },
      { id: "viridu", name: "Viridu Poetry", image: "📜" },
    ],
  },
  {
    id: "classical-dance",
    name: "Classical Dance",
    icon: Theater,
    color: "from-pink-500 to-rose-500",
    examples: [
      { id: "kandyan-dance", name: "Kandyan Dance", image: "💃" },
      { id: "low-country", name: "Low Country Dance", image: "🎭" },
      { id: "sabaragamuwa", name: "Sabaragamuwa Dance", image: "👯" },
      { id: "devil-dance", name: "Devil Dance (Yakun Natima)", image: "😈" },
    ],
  },
  {
    id: "visual-arts",
    name: "Visual Arts",
    icon: Palette,
    color: "from-violet-500 to-purple-500",
    examples: [
      { id: "batik", name: "Batik Art", image: "🎨" },
      { id: "mask-carving", name: "Mask Carving", image: "🎭" },
      { id: "wood-carving", name: "Wood Carving", image: "🪵" },
      { id: "temple-paintings", name: "Temple Paintings", image: "🖼️" },
    ],
  },
  {
    id: "literature",
    name: "Literature & Poetry",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-500",
    examples: [
      { id: "sinhala-poetry", name: "Sinhala Poetry", image: "📝" },
      { id: "tamil-literature", name: "Tamil Literature", image: "📚" },
      { id: "folk-tales", name: "Folk Tales", image: "📖" },
      { id: "jataka-stories", name: "Jataka Stories", image: "🪷" },
    ],
  },
  {
    id: "theater",
    name: "Theater & Drama",
    icon: Mic2,
    color: "from-blue-500 to-indigo-500",
    examples: [
      { id: "kolam", name: "Kolam", image: "🎪" },
      { id: "sokari", name: "Sokari", image: "🎭" },
      { id: "modern-drama", name: "Modern Drama", image: "🎬" },
      { id: "street-theater", name: "Street Theater", image: "🎤" },
    ],
  },
  {
    id: "festivals",
    name: "Festivals & Ceremonies",
    icon: Camera,
    color: "from-yellow-500 to-amber-500",
    examples: [
      { id: "esala-perahera", name: "Esala Perahera", image: "🐘" },
      { id: "vesak", name: "Vesak Celebrations", image: "🪷" },
      { id: "thai-pongal", name: "Thai Pongal", image: "🌾" },
      { id: "sinhala-new-year", name: "Sinhala New Year", image: "🎊" },
    ],
  },
];

interface SignupFlowProps {
  onComplete?: () => void;
  onBack?: () => void;
  isModal?: boolean;
}

type Step = "auth" | "location" | "categories" | "examples" | "complete";

export function SignupFlow({ onComplete, onBack, isModal = false }: SignupFlowProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("auth");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [authType, setAuthType] = useState<"google" | "email" | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedExamples, setSelectedExamples] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
  setError(null);
  await loginWithGoogle();
  setAuthType("google");
  // Do NOT move to location step here; wait for OAuth callback
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setError(null);
    
    try {
      // Register user with email
      const result = await registerUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone || undefined,
      });

      if (result.success) {
        setAuthType("email");
        setCurrentStep("location");
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Email signup failed:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleExample = (exampleId: string) => {
    setSelectedExamples((prev) =>
      prev.includes(exampleId)
        ? prev.filter((id) => id !== exampleId)
        : [...prev, exampleId]
    );
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // First update user profile with city (this updates User table)
      const profileResult = await updateUserProfile({
        city: selectedCity,
      });

      if (!profileResult.success) {
        console.error("Failed to update profile:", profileResult.error);
      }

      // Then save cultural preferences (this updates UserPreference table)
      const prefsResult = await saveUserPreferences({
        city: selectedCity,
        categories: selectedCategories,
        interests: selectedExamples,
      });

      if (prefsResult.success) {
        console.log("All data saved successfully!");
        setCurrentStep("complete");
        setTimeout(() => {
          onComplete?.();
          // Navigate to home page after signup
          router.push("/");
        }, 2000);
      } else {
        console.error("Failed to save preferences:", prefsResult.error);
        // Still complete the flow even if preferences fail to save
        setCurrentStep("complete");
        setTimeout(() => {
          onComplete?.();
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to save data:", error);
      // Still complete the flow even if saving fails
      setCurrentStep("complete");
      setTimeout(() => {
        onComplete?.();
        router.push("/");
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case "auth": return 1;
      case "location": return 2;
      case "categories": return 3;
      case "examples": return 4;
      case "complete": return 5;
      default: return 1;
    }
  };

  const renderProgressBar = () => {
    if (currentStep === "auth") return null;
    
    const steps = ["Location", "Interests", "Preferences"];
    const currentIndex = getStepNumber() - 2;

    return (
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  index <= currentIndex
                    ? "bg-violet-600 text-white"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                }`}
              >
                {index < currentIndex ? <Check size={16} /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-2 rounded transition-all ${
                    index < currentIndex
                      ? "bg-violet-600"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-zinc-500">
          {steps.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </div>
    );
  };

  // Step 1: Authentication
  if (currentStep === "auth") {
    return (
      <div className="w-full">
        <div className="flex items-center p-6 border-b dark:border-zinc-800">
          {onBack && (
            <button onClick={onBack} className="mr-3 text-zinc-500 hover:text-zinc-700">
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Join Rasaswadaya
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium dark:text-white">Create your account</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Discover Sri Lanka's rich cultural heritage
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isEmailLoading}
            className="w-full py-3 px-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {isGoogleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500">or</span>
            </div>
          </div>

          {/* Email Sign Up Form */}
          <form onSubmit={handleEmailSignup} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="First Name"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <input
              type="email"
              required
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password (min 6 characters)"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="submit"
              disabled={isEmailLoading || isGoogleLoading}
              className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isEmailLoading ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Creating account...
                </>
              ) : (
                "Continue with Email"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-400 pt-2">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Location Selection
  if (currentStep === "location") {
    return (
      <div className="w-full">
        <div className="flex items-center p-6 border-b dark:border-zinc-800">
          <button onClick={() => setCurrentStep("auth")} className="mr-3 text-zinc-500 hover:text-zinc-700">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Your Location
          </h2>
        </div>

        {renderProgressBar()}

        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-violet-600" />
            </div>
            <h3 className="text-lg font-medium dark:text-white">Where are you located?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              We'll show you cultural events near you
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {SRI_LANKAN_CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  selectedCity === city
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentStep("categories")}
            disabled={!selectedCity}
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
          >
            Continue <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Category Selection
  if (currentStep === "categories") {
    return (
      <div className="w-full">
        <div className="flex items-center p-6 border-b dark:border-zinc-800">
          <button onClick={() => setCurrentStep("location")} className="mr-3 text-zinc-500 hover:text-zinc-700">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Your Interests
          </h2>
        </div>

        {renderProgressBar()}

        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium dark:text-white">What interests you?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Select the cultural categories you'd like to explore
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {CULTURAL_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-medium text-sm dark:text-white">{category.name}</h4>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentStep("examples")}
            disabled={selectedCategories.length === 0}
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Continue <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Example Selection
  if (currentStep === "examples") {
    const selectedCategoryData = CULTURAL_CATEGORIES.filter((c) =>
      selectedCategories.includes(c.id)
    );

    return (
      <div className="w-full">
        <div className="flex items-center p-6 border-b dark:border-zinc-800">
          <button onClick={() => setCurrentStep("categories")} className="mr-3 text-zinc-500 hover:text-zinc-700">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Your Preferences
          </h2>
        </div>

        {renderProgressBar()}

        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium dark:text-white">Pick specific interests</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Select the events and art forms you'd like to see
            </p>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {selectedCategoryData.map((category) => (
              <div key={category.id}>
                <h4 className="font-medium text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {category.name}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {category.examples.map((example) => {
                    const isSelected = selectedExamples.includes(example.id);
                    return (
                      <button
                        key={example.id}
                        onClick={() => toggleExample(example.id)}
                        className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                          isSelected
                            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                        }`}
                      >
                        <span className="text-2xl">{example.image}</span>
                        <span className="text-sm font-medium dark:text-white text-left">
                          {example.name}
                        </span>
                        {isSelected && (
                          <Check size={16} className="text-violet-600 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleComplete}
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </>
            ) : (
              <>
                Complete Setup <Check size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Step 5: Complete
  if (currentStep === "complete") {
    return (
      <div className="w-full p-6">
        <div className="text-center space-y-4 py-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Welcome to Rasaswadaya!</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Your account is ready. Discover amazing cultural events in {selectedCity}!
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {selectedCategories.slice(0, 3).map((catId) => {
              const cat = CULTURAL_CATEGORIES.find((c) => c.id === catId);
              return cat ? (
                <span
                  key={catId}
                  className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full text-sm"
                >
                  {cat.name}
                </span>
              ) : null;
            })}
          </div>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
          >
            Go to Home <ArrowRight size={18} />
          </button>
          <p className="text-xs text-zinc-400 mt-2">Redirecting automatically...</p>
        </div>
      </div>
    );
  }

  return null;
}
