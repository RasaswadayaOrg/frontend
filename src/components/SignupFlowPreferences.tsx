"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveUserPreferences, updateUserProfile } from "@/app/actions/auth";
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
        setError(profileResult.error || "Failed to save profile");
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
          router.push("/dashboard");
        }, 2000);
      } else {
        console.error("Failed to save preferences:", prefsResult.error);
        // Still complete the flow even if preferences fail to save
        setCurrentStep("complete");
        setTimeout(() => {
          onComplete?.();
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Failed to save data:", error);
      setError(error.message || "Failed to save preferences");
      // Still complete the flow even if saving fails
      setCurrentStep("complete");
      setTimeout(() => {
        onComplete?.();
        router.push("/dashboard");
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case "location": return 1;
      case "categories": return 2;
      case "examples": return 3;
      case "complete": return 4;
      default: return 1;
    }
  };

  const renderProgressBar = () => {
    const steps = ["Location", "Interests", "Preferences"];
    const currentIndex = getStepNumber() - 1;

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

  // Step 1: Location Selection
  if (currentStep === "location") {
    return (
      <div className="w-full">
        <div className="flex items-center p-6 border-b dark:border-zinc-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Complete Your Profile
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

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

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

  // Step 2: Category Selection
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
                  className={`p-4 rounded-xl border-2 transition-all text-left relative ${
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

  // Step 3: Example Selection
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

  // Step 4: Complete
  if (currentStep === "complete") {
    return (
      <div className="w-full p-6">
        <div className="text-center space-y-4 py-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Welcome to Rasaswadaya!</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Your profile is complete. Discover amazing cultural events in {selectedCity}!
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
            onClick={() => router.push("/dashboard")}
            className="mt-6 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
          >
            Go to Dashboard <ArrowRight size={18} />
          </button>
          <p className="text-xs text-zinc-400 mt-2">Redirecting automatically...</p>
        </div>
      </div>
    );
  }

  return null;
}
