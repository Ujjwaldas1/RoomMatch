import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Settings,
  Heart
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import UserProfileModal from "./UserProfileModal";
import UserProfileDropdown from "./UserProfileDropdown";
import api from "../api";

export default function Navbar({ isAuthenticated, user, onLogout, isHomePage = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch pending requests count for notifications
  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingRequestsCount();
      // Set up interval to check for new requests every 30 seconds
      const interval = setInterval(fetchPendingRequestsCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchPendingRequestsCount = async () => {
    try {
      const response = await api.get('/connections/pending/received');
      const requests = response.data.requests || [];
      setPendingRequestsCount(requests.length);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setPendingRequestsCount(0);
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Find Roommates", path: "/dashboard", icon: Search },
    { name: "My Connections", path: "/connections", icon: Bell },
    { name: "Preferences", path: "/preferences", icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleUserProfile = () => {
    setIsUserProfileOpen(!isUserProfileOpen);
  };

  const closeUserProfile = () => {
    setIsUserProfileOpen(false);
  };

  const handleEditPreferences = () => {
    setIsUserProfileOpen(false);
    navigate('/preferences');
  };

  return (
    <>
      {/* CHANGE 1: Modified z-index and positioning */}
      <nav 
        className={`w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 ${isHomePage ? 'relative' : 'sticky top-0'}`}
        style={{ zIndex: isHomePage ? 40 : 50 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-3 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  RoomieConnect
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isConnections = item.path === '/connections';
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${isActive(item.path)
                      ? "bg-blue-100 text-blue-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {isConnections && pendingRequestsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CHANGE 2: Added relative positioning and higher z-index for dropdown container */}
            <div className="hidden md:flex items-center space-x-4 relative" style={{ zIndex: 9999 }}>
              <ThemeToggle />

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* User Profile Dropdown */}
                  <UserProfileDropdown user={user} onLogout={onLogout} />
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* CHANGE 3: Mobile Navigation Menu with proper z-index */}
          {isMenuOpen && (
            <div className="md:hidden" style={{ zIndex: 9998 }}>
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-slate-200">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isConnections = item.path === '/connections';
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive(item.path)
                        ? "bg-blue-100 text-blue-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                      {isConnections && pendingRequestsCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium ml-auto">
                          {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                        </span>
                      )}
                    </Link>
                  );
                })}

                {!isAuthenticated && (
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 text-slate-700 hover:text-slate-900 font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-center"
                    >
                      Get Started
                    </Link>
                  </div>
                )}

                {isAuthenticated && (
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user?.name ? user.name.split(" ").map(word => word.charAt(0)).join("").toUpperCase().slice(0, 2) : "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 w-full text-left rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* CHANGE 4: UserProfileModal with proper z-index */}
      {isUserProfileOpen && (
        <div style={{ zIndex: 10000 }}>
          <UserProfileModal
            user={user}
            onClose={closeUserProfile}
            onEditPreferences={handleEditPreferences}
          />
        </div>
      )}
    </>
  );
}