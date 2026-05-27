import React from "react";
import Navbar from "../components/Navbar";
import MatchDashboard from "../components/MatchDashboard";

export default function Dashboard({ user }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar user={user} onLogout={handleLogout} isAuthenticated={!!user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MatchDashboard />
      </div>
    </div>
  );
}
