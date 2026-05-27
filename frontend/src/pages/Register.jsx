import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserPlus, Eye, EyeOff, Mail, Lock, User, GraduationCap, CheckCircle, ArrowRight } from "lucide-react";
import api from "../api";

export default function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    year: "",
    major: "",
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const universities = [
    "Stanford University",
    "MIT",
    "Harvard University",
    "UC Berkeley",
    "UCLA",
    "Yale University",
    "Princeton University",
    "Columbia University",
    "University of Chicago",
    "Other"
  ];

  const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate Student"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        university: formData.university,
        year: formData.year,
        major: formData.major
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLogin(response.data.user);
        navigate('/preferences');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left panel - Branding */}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold">Join RoomieConnect!</h2>
                </div>

                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Start your journey to find the perfect roommate. Connect with like-minded students and create lasting friendships.
                </p>

                <div className="space-y-4">
                  {[
                    "AI-powered matching algorithm",
                    "Verified student profiles only",
                    "Safe and secure platform",
                    "Free to join and use"
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Registration Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
                <p className="text-slate-600">Join thousands of students finding their perfect roommates</p>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                    1
                  </div>
                  <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                    2
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <>
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                        Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Create a password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    {/* University Field */}
                    <div className="space-y-2">
                      <label htmlFor="university" className="block text-sm font-semibold text-slate-700">
                        University *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <GraduationCap className="h-5 w-5 text-slate-400" />
                        </div>
                        <select
                          id="university"
                          name="university"
                          required
                          value={formData.university}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                        >
                          <option value="">Select your university</option>
                          {universities.map((uni) => (
                            <option key={uni} value={uni}>{uni}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Year Field */}
                    <div className="space-y-2">
                      <label htmlFor="year" className="block text-sm font-semibold text-slate-700">
                        Academic Year *
                      </label>
                      <select
                        id="year"
                        name="year"
                        required
                        value={formData.year}
                        onChange={handleChange}
                        className="block w-full px-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                      >
                        <option value="">Select your year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    {/* Major Field */}
                    <div className="space-y-2">
                      <label htmlFor="major" className="block text-sm font-semibold text-slate-700">
                        Major/Field of Study
                      </label>
                      <input
                        id="major"
                        name="major"
                        type="text"
                        value={formData.major}
                        onChange={handleChange}
                        className="block w-full px-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Computer Science, Business, etc."
                      />
                    </div>

                    {/* Terms Agreement */}
                    <div className="space-y-4">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded mt-1"
                        />
                        <span className="ml-3 text-sm text-slate-600">
                          I agree to the{" "}
                          <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !formData.agreeToTerms}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="w-5 h-5" />
                            Create Account
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>

              {/* Sign In Link */}
              <div className="mt-8 text-center">
                <p className="text-slate-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
