import { useState, useEffect } from "react";
import api from "../api";
import { 
  Heart, 
  MessageCircle, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Star,
  MoreHorizontal,
  User,
  CheckCircle,
  X,
  Home,
  Music,
  Clock,
  Moon,
  Sun,
  Users as UsersIcon,
  Coffee,
  UserPlus,
  UserCheck,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function RoommateCard({ user }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('loading'); // Start with 'loading' state
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Load actual connection status when component mounts
  useEffect(() => {
    loadConnectionStatus();
  }, [user]);

  const loadConnectionStatus = async () => {
    try {
      const userId = user.id || user.name;
      const response = await api.get(`/connections/status/${userId}`);
      setConnectionStatus(response.data.status || 'none');
    } catch (error) {
      console.error('Error loading connection status:', error);
      setConnectionStatus('none'); // Default to 'none' if error
    }
  };

  const compatibilityScore = user.compatibilityScore || Math.floor(Math.random() * 40) + 60;
  const distance = user.distance || `${Math.floor(Math.random() * 5) + 1} miles away`;

  // Function to get display text for lifestyle preferences
  const getPreferenceDisplay = (value, type) => {
    const lifestyleOptions = {
      cleanliness: {
        "very-clean": { label: "Very Clean", icon: "✨" },
        "clean": { label: "Clean", icon: "🧹" },
        "moderate": { label: "Moderate", icon: "📦" },
        "relaxed": { label: "Relaxed", icon: "😌" }
      },
      noiseLevel: {
        "very-quiet": { label: "Very Quiet", icon: "🔇" },
        "quiet": { label: "Quiet", icon: "🤫" },
        "moderate": { label: "Moderate", icon: "🔉" },
        "loud": { label: "Loud", icon: "🔊" }
      },
      socialLevel: {
        "introvert": { label: "Introvert", icon: "📚" },
        "ambivert": { label: "Ambivert", icon: "⚖️" },
        "extrovert": { label: "Extrovert", icon: "🎉" }
      },
      studyHabits: {
        "intensive": { label: "Intensive", icon: "📖" },
        "moderate": { label: "Moderate", icon: "📝" },
        "light": { label: "Light", icon: "✏️" }
      },
      sleepSchedule: {
        "early-bird": { label: "Early Bird", icon: "🌅" },
        "night-owl": { label: "Night Owl", icon: "🦉" },
        "flexible": { label: "Flexible", icon: "🔄" }
      }
    };

    if (lifestyleOptions[type] && lifestyleOptions[type][value]) {
      return lifestyleOptions[type][value];
    }
    return { label: value, icon: "🏠" };
  };

  // Get lifestyle preferences from user object
  const getLifestylePreferences = () => {
    const preferences = [];
    if (user.preferences) {
      if (user.preferences.cleanliness) {
        const pref = getPreferenceDisplay(user.preferences.cleanliness, 'cleanliness');
        preferences.push({ type: 'cleanliness', ...pref, icon: <Home className="w-4 h-4" /> });
      }
      if (user.preferences.noiseLevel) {
        const pref = getPreferenceDisplay(user.preferences.noiseLevel, 'noiseLevel');
        preferences.push({ type: 'noiseLevel', ...pref, icon: <Music className="w-4 h-4" /> });
      }
      if (user.preferences.sleepSchedule) {
        const pref = getPreferenceDisplay(user.preferences.sleepSchedule, 'sleepSchedule');
        let icon = <Clock className="w-4 h-4" />;
        if (user.preferences.sleepSchedule === 'early-bird') icon = <Sun className="w-4 h-4" />;
        if (user.preferences.sleepSchedule === 'night-owl') icon = <Moon className="w-4 h-4" />;
        preferences.push({ type: 'sleepSchedule', ...pref, icon });
      }
      if (user.preferences.socialLevel) {
        const pref = getPreferenceDisplay(user.preferences.socialLevel, 'socialLevel');
        preferences.push({ type: 'socialLevel', ...pref, icon: <UsersIcon className="w-4 h-4" /> });
      }
      if (user.preferences.studyHabits) {
        const pref = getPreferenceDisplay(user.preferences.studyHabits, 'studyHabits');
        preferences.push({ type: 'studyHabits', ...pref, icon: <BookOpen className="w-4 h-4" /> });
      }
    }
    return preferences;
  };

  const lifestylePrefs = getLifestylePreferences();

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleConnect = async (e) => {
    e.stopPropagation();
    
    if (connectionStatus === 'connected' || connectionStatus === 'accepted') {
      // If already connected, show options to disconnect or message
      setShowConfirmDialog(true);
      return;
    }
    
    if (connectionStatus === 'pending') {
      // If request is pending, allow cancellation
      setShowConfirmDialog(true);
      return;
    }
    
    if (connectionStatus === 'loading') {
      // Don't allow action while loading
      return;
    }
    
    // Send connection request
    await sendConnectionRequest();
  };

  const sendConnectionRequest = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      const response = await api.post('/connections/request', { 
        userId: user.id || user.name // Use id if available, fallback to name
      });
      
      if (response.status === 200 || response.status === 201) {
        // Reload the actual status from backend
        await loadConnectionStatus();
        
        // Show success message
        setTimeout(() => {
          setConnectionError({ type: 'success', message: 'Connection request sent!' });
          setTimeout(() => setConnectionError(null), 3000);
        }, 500);
      }
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionError({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to send request. Please try again.' 
      });
      setTimeout(() => setConnectionError(null), 5000);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCancelRequest = async () => {
    setIsConnecting(true);
    try {
      const userId = user.id || user.name;
      await api.delete(`/connections/cancel/${userId}`);
      
      // Reload the actual status from backend
      await loadConnectionStatus();
      
      setConnectionError({ type: 'success', message: 'Request cancelled' });
      setTimeout(() => setConnectionError(null), 3000);
    } catch (error) {
      console.error('Cancel request error:', error);
      setConnectionError({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to cancel request' 
      });
      setTimeout(() => setConnectionError(null), 5000);
    } finally {
      setIsConnecting(false);
      setShowConfirmDialog(false);
    }
  };

  const handleDisconnect = async () => {
    setIsConnecting(true);
    try {
      const userId = user.id || user.name;
      await api.delete(`/connections/remove/${userId}`);
      
      // Reload the actual status from backend
      await loadConnectionStatus();
      
      setConnectionError({ type: 'success', message: 'Connection removed' });
      setTimeout(() => setConnectionError(null), 3000);
    } catch (error) {
      console.error('Disconnect error:', error);
      setConnectionError({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to remove connection' 
      });
      setTimeout(() => setConnectionError(null), 5000);
    } finally {
      setIsConnecting(false);
      setShowConfirmDialog(false);
    }
  };

  const getConnectButtonContent = () => {
    if (isConnecting) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Connecting...
        </>
      );
    }
    
    if (connectionStatus === 'loading') {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Loading...
        </>
      );
    }
    
    switch (connectionStatus) {
      case 'accepted':
      case 'connected':
        return (
          <>
            <UserCheck className="w-4 h-4 mr-2" />
            Connected
          </>
        );
      case 'pending':
        return (
          <>
            <Clock className="w-4 h-4 mr-2" />
            Pending
          </>
        );
      default:
        return (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Connect
          </>
        );
    }
  };

  const getConnectButtonStyle = () => {
    if (connectionStatus === 'loading') {
      return "flex-1 bg-slate-400 text-white py-2 px-4 rounded-xl font-semibold text-sm cursor-not-allowed flex items-center justify-center";
    }
    if (connectionStatus === 'connected' || connectionStatus === 'accepted') {
      return "flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center";
    }
    if (connectionStatus === 'pending') {
      return "flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center";
    }
    return "flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center";
  };

  const handleMessage = (e) => {
    e.stopPropagation();
    // Handle message logic
    console.log("Messaging", user.name);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Header with Image and Actions */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=random`}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-white shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">{user.name}</h3>
              <p className="text-sm text-slate-600">{user.university || user.college}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${
                isLiked 
                  ? "bg-red-100 text-red-500" 
                  : "bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button className="p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Compatibility Score */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-slate-700">
              {compatibilityScore}% Match
            </span>
          </div>
          <div className="flex items-center space-x-1 text-slate-500">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{distance}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${compatibilityScore}%` }}
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="px-6 pb-4">
        {/* University and Year */}
        <div className="flex items-center justify-between mb-3 text-sm text-slate-600">
          <div className="flex items-center space-x-1">
            <GraduationCap className="w-4 h-4" />
            <span>{user.university || "University not specified"}</span>
          </div>
          {user.year && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{user.year}</span>
            </div>
          )}
        </div>

        {/* Major */}
        {user.major && (
          <div className="flex items-center space-x-1 mb-3 text-sm text-slate-600">
            <BookOpen className="w-4 h-4" />
            <span>{user.major}</span>
          </div>
        )}

        {/* Lifestyle Preferences */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {lifestylePrefs.slice(0, 3).map((pref, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
              >
                {pref.icon}
                <span>{pref.label}</span>
              </div>
            ))}
            {lifestylePrefs.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                +{lifestylePrefs.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Interests */}
        {user.preferences?.interests && user.preferences.interests.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {user.preferences.interests.slice(0, 3).map((interest, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                >
                  {interest}
                </span>
              ))}
              {user.preferences.interests.length > 3 && (
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                  +{user.preferences.interests.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Connection Error/Success Message */}
        {connectionError && (
          <div className={`mb-3 p-2 rounded-lg text-sm flex items-center space-x-2 ${
            connectionError.type === 'error' 
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {connectionError.type === 'error' ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{connectionError.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleConnect}
            disabled={isConnecting || connectionStatus === 'loading'}
            className={getConnectButtonStyle()}
          >
            {getConnectButtonContent()}
          </button>
          <button
            onClick={handleMessage}
            disabled={connectionStatus !== 'connected' && connectionStatus !== 'accepted'}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
              connectionStatus === 'connected' || connectionStatus === 'accepted'
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title={connectionStatus !== 'connected' && connectionStatus !== 'accepted' ? 'Connect first to send messages' : 'Send message'}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="px-6 pb-6 border-t border-slate-100 pt-4">
          <div className="space-y-4">
            {/* Bio */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">About</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {user.preferences?.bio || user.bio || "No bio available yet."}
              </p>
            </div>
            
            {/* All Lifestyle Preferences */}
            {lifestylePrefs.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Lifestyle</h4>
                <div className="grid grid-cols-2 gap-2">
                  {lifestylePrefs.map((pref, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg">
                      {pref.icon}
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{pref.type.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-sm font-medium text-slate-900">{pref.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* All Interests */}
            {user.preferences?.interests && user.preferences.interests.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Interests</h4>
                <div className="flex flex-wrap gap-1">
                  {user.preferences.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Contact Information */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Contact Info</h4>
              <div className="space-y-1 text-sm text-slate-600">
                <p>University: {user.university || "Not specified"}</p>
                <p>Year: {user.year || "Not specified"}</p>
                <p>Major: {user.major || "Not specified"}</p>
                {user.course && <p>Course: {user.course}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expand/Collapse Button */}
      <div className="px-6 pb-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          {showDetails ? "Show Less" : "Show More"}
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowConfirmDialog(false)}>
          <div className="bg-white rounded-xl p-6 m-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {(connectionStatus === 'connected' || connectionStatus === 'accepted') ? 'Manage Connection' : 'Cancel Request'}
              </h3>
              
              <p className="text-sm text-gray-500 mb-6">
                {(connectionStatus === 'connected' || connectionStatus === 'accepted') 
                  ? `What would you like to do with your connection to ${user.name}?`
                  : `Cancel your connection request to ${user.name}?`
                }
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                
                {(connectionStatus === 'connected' || connectionStatus === 'accepted') ? (
                  <button
                    onClick={handleDisconnect}
                    disabled={isConnecting}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isConnecting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : null}
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={handleCancelRequest}
                    disabled={isConnecting}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isConnecting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : null}
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
