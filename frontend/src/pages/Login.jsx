import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogIn, Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import api from "../api";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/auth/login", {
        email: formData.email,
        password: formData.password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLogin(response.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold">Welcome back!</h2>
                </div>

                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Pick up where you left off. Your perfect roommate might be one login away.
                </p>

                <div className="space-y-4">
                  {[
                    "Smart compatibility matching",
                    "Filter by lifestyle preferences",
                    "Safe, student-first community",
                    "Verified profiles only"
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

          {/* Right panel - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h1>
                <p className="text-slate-600">Welcome back! Please sign in to your account.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                    Email Address
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
                    Password
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
                      placeholder="Enter your password"
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <span className="ml-2 text-sm text-slate-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-slate-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                  >
                    Create one now
                  </Link>
                </p>
              </div>

              {/* Demo Account */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-600 text-center mb-2">Demo Account:</p>
                <p className="text-xs text-slate-500 text-center">
                  Email: demo@roomieconnect.com<br />
                  Password: demo123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
