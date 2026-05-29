import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Home,
  Users,
  Clock,
  Music,
  Coffee,
  Dumbbell,
  BookOpen,
  Moon,
  Sun,
  Heart,
  Shield,
  Sparkles
} from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function PreferenceForm({ user }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    // Lifestyle preferences
    cleanliness: "",
    noiseLevel: "",
    socialLevel: "",
    studyHabits: "",
    sleepSchedule: "",
    partying: "",
    pets: "",
    smoking: "",

    // Living preferences
    budget: "",
    location: "",
    roomType: "",
    leaseLength: "",

    // Personal interests
    interests: [],
    hobbies: [],

    // Additional info
    bio: "",
    dealBreakers: []
  });

  const navigate = useNavigate();
  const totalSteps = 4;
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const lifestyleOptions = {
    cleanliness: [
      { value: "very-clean", label: "Very Clean", icon: "✨", desc: "I keep everything spotless" },
      { value: "clean", label: "Clean", icon: "🧹", desc: "I maintain a tidy space" },
      { value: "moderate", label: "Moderate", icon: "📦", desc: "I keep things organized" },
      { value: "relaxed", label: "Relaxed", icon: "😌", desc: "I'm comfortable with some mess" }
    ],
    noiseLevel: [
      { value: "very-quiet", label: "Very Quiet", icon: "🔇", desc: "Silence is golden" },
      { value: "quiet", label: "Quiet", icon: "🤫", desc: "Low noise preferred" },
      { value: "moderate", label: "Moderate", icon: "🔉", desc: "Normal noise levels" },
      { value: "loud", label: "Loud", icon: "🔊", desc: "I don't mind noise" }
    ],
    socialLevel: [
      { value: "introvert", label: "Introvert", icon: "📚", desc: "I prefer quiet time" },
      { value: "ambivert", label: "Ambivert", icon: "⚖️", desc: "I enjoy both social and alone time" },
      { value: "extrovert", label: "Extrovert", icon: "🎉", desc: "I love being social" }
    ],
    studyHabits: [
      { value: "intensive", label: "Intensive", icon: "📖", desc: "I study a lot and need quiet" },
      { value: "moderate", label: "Moderate", icon: "📝", desc: "I study regularly" },
      { value: "light", label: "Light", icon: "✏️", desc: "I study occasionally" }
    ],
    sleepSchedule: [
      { value: "early-bird", label: "Early Bird", icon: "🌅", desc: "I wake up early" },
      { value: "night-owl", label: "Night Owl", icon: "🦉", desc: "I stay up late" },
      { value: "flexible", label: "Flexible", icon: "🔄", desc: "My schedule varies" }
    ]
  };

  const interestOptions = [
    "Sports", "Music", "Art", "Gaming", "Reading", "Cooking", "Travel", "Fitness",
    "Photography", "Movies", "Dancing", "Writing", "Technology", "Nature", "Volunteering"
  ];

  const handlePreferenceChange = (category, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleInterestToggle = (interest) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/api/users/preferences", preferences);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return preferences.cleanliness && preferences.noiseLevel && preferences.socialLevel;
      case 2:
        return preferences.studyHabits && preferences.sleepSchedule;
      case 3:
        return preferences.interests.length >= 3;
      case 4:
        return preferences.bio.length >= 20;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Lifestyle Preferences</h2>
        <p className="text-slate-600">Tell us about your living style to find compatible roommates</p>
      </div>

      <div className="space-y-8">
        {/* Cleanliness */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5" />
            How clean do you like to keep things?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lifestyleOptions.cleanliness.map(option => (
              <button
                key={option.value}
                onClick={() => handlePreferenceChange("cleanliness", option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${preferences.cleanliness === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                  }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="font-semibold text-slate-900">{option.label}</div>
                <div className="text-sm text-slate-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Noise Level */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Music className="w-5 h-5" />
            What noise level do you prefer?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lifestyleOptions.noiseLevel.map(option => (
              <button
                key={option.value}
                onClick={() => handlePreferenceChange("noiseLevel", option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${preferences.noiseLevel === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                  }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="font-semibold text-slate-900">{option.label}</div>
                <div className="text-sm text-slate-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Social Level */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            How social are you?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lifestyleOptions.socialLevel.map(option => (
              <button
                key={option.value}
                onClick={() => handlePreferenceChange("socialLevel", option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${preferences.socialLevel === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                  }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="font-semibold text-slate-900">{option.label}</div>
                <div className="text-sm text-slate-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Study & Sleep Habits</h2>
        <p className="text-slate-600">Help us understand your daily routine</p>
      </div>

      <div className="space-y-8">
        {/* Study Habits */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            How much do you study?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lifestyleOptions.studyHabits.map(option => (
              <button
                key={option.value}
                onClick={() => handlePreferenceChange("studyHabits", option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${preferences.studyHabits === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                  }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="font-semibold text-slate-900">{option.label}</div>
                <div className="text-sm text-slate-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Schedule */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            What's your sleep schedule?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lifestyleOptions.sleepSchedule.map(option => (
              <button
                key={option.value}
                onClick={() => handlePreferenceChange("sleepSchedule", option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${preferences.sleepSchedule === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                  }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="font-semibold text-slate-900">{option.label}</div>
                <div className="text-sm text-slate-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Interests & Hobbies</h2>
        <p className="text-slate-600">Select at least 3 interests to help us find compatible roommates</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          What are you interested in?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {interestOptions.map(interest => (
            <button
              key={interest}
              onClick={() => handleInterestToggle(interest)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${preferences.interests.includes(interest)
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
            >
              {interest}
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-2">
          {preferences.interests.length} selected (minimum 3 required)
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Tell Us About Yourself</h2>
        <p className="text-slate-600">Write a brief bio to help potential roommates get to know you</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Bio
        </h3>
        <textarea
          value={preferences.bio}
          onChange={(e) => handlePreferenceChange("bio", e.target.value)}
          placeholder="Tell potential roommates about yourself, your interests, what you're looking for in a roommate, etc..."
          className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="text-sm text-slate-500 mt-2">
          {preferences.bio.length}/500 characters (minimum 20 required)
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar isAuthenticated={true} user={user} onLogout={handleLogout} />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Set Your Preferences</h1>
            <span className="text-sm text-slate-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation */}
          <div className="flex justify-between mt-12 pt-8 border-t border-slate-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepComplete(currentStep) || loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : currentStep === totalSteps ? (
                <>
                  Complete Setup
                  <CheckCircle className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
