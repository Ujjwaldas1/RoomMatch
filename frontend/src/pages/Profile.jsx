import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Edit,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  BookOpen,
  Heart,
  Clock,
  Moon,
  Sun,
  Users,
  Settings,
  Save,
  X,
  Sparkles,
  Music,
  Home,
  Shield,
  Coffee
} from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  // Function to get display text for lifestyle preferences
  const getPreferenceDisplay = (value, options) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  // Lifestyle options mapping (same as in PreferenceForm)
  const lifestyleOptions = {
    cleanliness: [
      { value: "very-clean", label: "Very Clean" },
      { value: "clean", label: "Clean" },
      { value: "moderate", label: "Moderate" },
      { value: "relaxed", label: "Relaxed" }
    ],
    noiseLevel: [
      { value: "very-quiet", label: "Very Quiet" },
      { value: "quiet", label: "Quiet" },
      { value: "moderate", label: "Moderate" },
      { value: "loud", label: "Loud" }
    ],
    socialLevel: [
      { value: "introvert", label: "Introvert" },
      { value: "ambivert", label: "Ambivert" },
      { value: "extrovert", label: "Extrovert" }
    ],
    studyHabits: [
      { value: "intensive", label: "Intensive" },
      { value: "moderate", label: "Moderate" },
      { value: "light", label: "Light" }
    ],
    sleepSchedule: [
      { value: "early-bird", label: "Early Bird" },
      { value: "night-owl", label: "Night Owl" },
      { value: "flexible", label: "Flexible" }
    ]
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/users/profile");
      setUser(response.data);
      setEditForm({
        name: response.data.name || "",
        university: response.data.university || "",
        course: response.data.course || "",
        major: response.data.major || "",
        year: response.data.year || "",
        phone: response.data.phone || "",
        bio: response.data.bio || ""
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editing) {
      // Reset form to original values
      setEditForm({
        name: user.name || "",
        university: user.university || "",
        course: user.course || "",
        major: user.major || "",
        year: user.year || "",
        phone: user.phone || "",
        bio: user.bio || ""
      });
    }
    setEditing(!editing);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await api.put("/api/users/profile", editForm);
      
      // Update local user state
      setUser(prev => ({
        ...prev,
        ...editForm
      }));
      
      setEditing(false);
      // You could add a success toast here
    } catch (error) {
      console.error("Error updating profile:", error);
      // You could add an error toast here
    } finally {
      setSaving(false);
    }
  };

  const handleEditPreferences = () => {
    navigate('/preferences');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
          <p className="text-slate-600 mb-6">Unable to load your profile information.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar isAuthenticated={true} user={user} onLogout={handleLogout} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
              <p className="text-xl text-slate-600">Manage your personal information and preferences</p>
            </div>
            <div className="flex gap-3">
              {editing ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    {editing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="text-3xl font-bold bg-transparent border-b-2 border-white/30 focus:border-white outline-none placeholder-white/70"
                        placeholder="Your Name"
                      />
                    ) : (
                      <h2 className="text-3xl font-bold">{user.name}</h2>
                    )}
                    <p className="text-blue-100 mt-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">University</label>
                    {editing ? (
                      <input
                        type="text"
                        value={editForm.university}
                        onChange={(e) => setEditForm(prev => ({ ...prev, university: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your University"
                      />
                    ) : (
                      <p className="text-lg text-slate-900 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-slate-500" />
                        {user.university || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Academic Year</label>
                    {editing ? (
                      <select
                        value={editForm.year}
                        onChange={(e) => setEditForm(prev => ({ ...prev, year: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Year</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate Student">Graduate Student</option>
                      </select>
                    ) : (
                      <p className="text-lg text-slate-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-slate-500" />
                        {user.year || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Major</label>
                    {editing ? (
                      <input
                        type="text"
                        value={editForm.major}
                        onChange={(e) => setEditForm(prev => ({ ...prev, major: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Computer Science"
                      />
                    ) : (
                      <p className="text-lg text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-slate-500" />
                        {user.major || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Course</label>
                    {editing ? (
                      <input
                        type="text"
                        value={editForm.course}
                        onChange={(e) => setEditForm(prev => ({ ...prev, course: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your Course"
                      />
                    ) : (
                      <p className="text-lg text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-slate-500" />
                        {user.course || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-600">Phone</label>
                    {editing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your Phone Number"
                      />
                    ) : (
                      <p className="text-lg text-slate-900 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-slate-500" />
                        {user.phone || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">About Me</h4>
                  {editing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full h-32 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tell others about yourself..."
                    />
                  ) : (
                    <div className="bg-slate-50 p-6 rounded-xl">
                      <p className="text-slate-700 leading-relaxed">
                        {user.bio || "No bio available. Click 'Edit Profile' to add information about yourself!"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleEditPreferences}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  Edit Preferences
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  Find Roommates
                </button>
              </div>
            </div>

            {/* Preferences Summary */}
            {user.preferences && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Lifestyle Preferences
                </h3>
                <div className="space-y-4">
                  {user.preferences.cleanliness && (
                    <div className="flex items-center gap-3">
                      <Home className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Cleanliness</p>
                        <p className="font-medium text-slate-900">
                          {getPreferenceDisplay(user.preferences.cleanliness, lifestyleOptions.cleanliness)}
                        </p>
                      </div>
                    </div>
                  )}
                  {user.preferences.noiseLevel && (
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Noise Level</p>
                        <p className="font-medium text-slate-900">
                          {getPreferenceDisplay(user.preferences.noiseLevel, lifestyleOptions.noiseLevel)}
                        </p>
                      </div>
                    </div>
                  )}
                  {user.preferences.sleepSchedule && (
                    <div className="flex items-center gap-3">
                      {user.preferences.sleepSchedule === 'early-bird' ? (
                        <Sun className="w-5 h-5 text-slate-400" />
                      ) : user.preferences.sleepSchedule === 'night-owl' ? (
                        <Moon className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-slate-400" />
                      )}
                      <div>
                        <p className="text-sm text-slate-600">Sleep Schedule</p>
                        <p className="font-medium text-slate-900">
                          {getPreferenceDisplay(user.preferences.sleepSchedule, lifestyleOptions.sleepSchedule)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Interests */}
                {user.preferences.interests && user.preferences.interests.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-slate-600 mb-3">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.preferences.interests.slice(0, 6).map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                      {user.preferences.interests.length > 6 && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                          +{user.preferences.interests.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}