import React, { useEffect, useState } from "react";
import api from "../api";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

// MatchDashboard – displays a list of potential matches fetched from the backend.
// Each match shows compatibility %, a list of shared interests and Accept/Reject actions.
// Uses the existing Tailwind configuration for styling and follows the visual language
// of the existing RoommateCard component.

export default function MatchDashboard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionIds, setActionIds] = useState([]); // ids currently being accepted/rejected

  // Load matches on component mount
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get("/matches");
        // Debug: log raw response data
        console.log('Fetched matches raw data:', response.data);
        // Transform backend DTO to frontend expected shape
        const transformed = (response.data || []).map((item, idx) => ({
          id: item.userId ?? item.id ?? idx,
          name: item.name,
          compatibility: item.compatibilityScore ?? item.compatibility,
          sharedInterests: item.sharedInterests || [],
          avatar: item.avatar || null,
        }));
        setMatches(transformed);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Unauthorized – likely missing or invalid token
          setError("Unauthorized. Please log in.");
          // Optionally redirect to login page
          // window.location.href = "/login";
        } else {
          console.error("Failed to fetch matches", err);
          setError("Failed to load matches. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleAction = async (matchId, type) => {
    setActionIds((prev) => [...prev, matchId]);
    try {
      if (type === "accept") {
        // Send a connection request to the target user
        await api.post(`/connections/request`, { userId: matchId });
      } else if (type === "reject") {
        // No backend call needed for rejection; simply remove from UI
        // Optionally you could send a notification or log
      }
      // Optimistically remove the match from the list after a successful response or rejection.
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
    } catch (err) {
      console.error(`Failed to ${type} match ${matchId}`, err);
    } finally {
      setActionIds((prev) => prev.filter((id) => id !== matchId));
    }
  };

  if (loading) {
    // Show skeleton cards while loading
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 bg-slate-200 rounded-full" />
              <div className="h-6 w-1/3 bg-slate-200 rounded" />
            </div>
            <div className="h-4 w-1/4 bg-slate-200 rounded mb-2" />
            <div className="flex flex-wrap gap-1 mb-4">
              <div className="h-5 w-16 bg-slate-200 rounded" />
              <div className="h-5 w-16 bg-slate-200 rounded" />
            </div>
            <div className="flex space-x-2">
              <div className="flex-1 h-8 bg-slate-200 rounded" />
              <div className="flex-1 h-8 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        No compatible roommates found
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match, index) => (
        <div
          key={match.id ?? `match-${index}`}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-transform hover:shadow-xl hover:-translate-y-1"
        >
          {/* Avatar & Name */}
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={match.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.name}`}
              alt={match.name}
              className="w-14 h-14 rounded-full border-2 border-white shadow-sm"
            />
            <h3 className="text-lg font-semibold text-slate-900">{match.name}</h3>
          </div>

          {/* Compatibility */}
          {/* Compatibility with color coding */}
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4" style={{ color:
              match.compatibility >= 90 ? '#10B981' : // green-500
              match.compatibility >= 70 ? '#3B82F6' : // blue-500
              match.compatibility >= 50 ? '#F59E0B' : // yellow-500
              '#EF4444' // red-500
            }} />
            <span className="text-sm font-medium" style={{ color:
              match.compatibility >= 90 ? '#10B981' :
              match.compatibility >= 70 ? '#3B82F6' :
              match.compatibility >= 50 ? '#F59E0B' :
              '#EF4444'
            }}>
              {match.compatibility}% Compatibility
            </span>
          </div>

          {/* Shared Interests */}
          {match.sharedInterests && match.sharedInterests.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-600 mb-1">Shared Interests</p>
              <div className="flex flex-wrap gap-1">
                {match.sharedInterests.slice(0, 5).map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                  >
                    {interest}
                  </span>
                ))}
                {match.sharedInterests.length > 5 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                    +{match.sharedInterests.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
          {/* Why Matched Section */}
          <div className="mt-2 text-sm text-slate-600">
            <p className="font-medium mb-1">Why matched</p>
            <ul className="list-disc list-inside space-y-1">
              {match.sharedInterests && match.sharedInterests.map((interest, idx) => (
                <li key={idx}>Shared {interest.toLowerCase()}</li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          {/* Action Buttons – full width on mobile */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleAction(match.id ?? index, "accept")}
              disabled={actionIds.includes(match.id ?? index)}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-colors 
                ${actionIds.includes(match.id ?? index)
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"}`}
            >
              {actionIds.includes(match.id ?? index) ? (
                <Loader2 className="w-4 h-4 animate-spin inline-block mr-1" />
              ) : null}
              Accept
            </button>
            <button
              onClick={() => handleAction(match.id ?? index, "reject")}
              disabled={actionIds.includes(match.id ?? index)}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-colors 
                ${actionIds.includes(match.id ?? index)
                   ? "bg-red-300 cursor-not-allowed"
                   : "bg-red-600 hover:bg-red-700 text-white"}`}
            >
              {actionIds.includes(match.id ?? index) ? (
                <Loader2 className="w-4 h-4 animate-spin inline-block mr-1" />
              ) : null}
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
