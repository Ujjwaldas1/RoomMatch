import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  UserCircle
} from "lucide-react";

export default function UserProfileDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      // Use both mousedown and click for better compatibility
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("click", handleClickOutside);
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isOpen]);

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      closeDropdown();
      // Execute logout immediately
      if (onLogout) {
        await onLogout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavigate = (path) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeDropdown();
    navigate(path);
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" style={{ zIndex: 9999 }} ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          isOpen 
            ? "bg-blue-50 text-blue-700 ring-2 ring-blue-500 ring-opacity-20" 
            : "hover:bg-slate-100 text-slate-700"
        }`}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {getUserInitials(user?.name)}
        </div>
        
        {/* User Name (hidden on small screens) */}
        <span className="hidden sm:block text-sm font-medium max-w-32 truncate">
          {user?.name || "User"}
        </span>
        
        {/* Dropdown Arrow */}
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 min-w-[200px] max-w-xs w-auto bg-white rounded-xl shadow-2xl border border-slate-200 py-2"
          style={{ zIndex: 10000 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {getUserInitials(user?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleNavigate('/profile')}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
              type="button"
            >
              <UserCircle className="w-4 h-4" />
              <span>My Profile</span>
            </button>
            
            <button
              onClick={handleNavigate('/preferences')}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
              type="button"
            >
              <Settings className="w-4 h-4" />
              <span>Preferences</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
              type="button"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}