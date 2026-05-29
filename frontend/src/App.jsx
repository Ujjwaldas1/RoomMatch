import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Connections from "./pages/Connections";
import PreferenceForm from "./components/PreferenceForm";
import api from "./api";
import "./App.css";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Only show navbar on the home page
  const showNavbar = false; // Changed to never show navbar in App.jsx since Home page now has its own

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token is valid by making an API call
      const verifyToken = async () => {
        try {
          const response = await api.get("/api/users/profile");
          if (response.data) {
            setIsAuthenticated(true);
            setUser(response.data);
          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          // Network error or invalid token
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      verifyToken();
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {showNavbar && (
        <Navbar
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <main className={showNavbar ? '' : 'pt-0'}>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />} />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={<Register onLogin={handleLogin} />}
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard user={user} /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? <Profile /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/connections"
            element={
              isAuthenticated ? <Connections user={user} /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/preferences"
            element={
              isAuthenticated ? <PreferenceForm user={user} /> : <Login onLogin={handleLogin} />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
