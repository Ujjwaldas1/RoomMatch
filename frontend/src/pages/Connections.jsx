import { useState, useEffect } from "react";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageCircle,
  UserPlus,
  UserCheck,
  UserX,
  Bell,
  Loader2,
  AlertCircle
} from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function Connections({ user }) {
  const [pendingReceived, setPendingReceived] = useState([]);
  const [pendingSent, setPendingSent] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // 'received', 'sent', 'connected'
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchConnectionData();
  }, []);

  const fetchConnectionData = async () => {
    try {
      setLoading(true);
      
      // Fetch all connection data in parallel
      const [receivedRes, sentRes, connectionsRes] = await Promise.all([
        api.get('/connections/pending/received'),
        api.get('/connections/pending/sent'),
        api.get('/connections/accepted')
      ]);

      setPendingReceived(receivedRes.data.requests || []);
      setPendingSent(sentRes.data.requests || []);
      setConnections(connectionsRes.data.connections || []);
    } catch (error) {
      console.error('Error fetching connection data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (connectionId) => {
    try {
      setActionLoading(connectionId);
      
      const response = await api.post(`/connections/accept/${connectionId}`);
      
      if (response.data.success) {
        // Refresh data after successful action
        await fetchConnectionData();
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (connectionId) => {
    try {
      setActionLoading(connectionId);
      
      const response = await api.post(`/connections/reject/${connectionId}`);
      
      if (response.data.success) {
        // Refresh data after successful action
        await fetchConnectionData();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelRequest = async (connectionId) => {
    try {
      setActionLoading(connectionId);
      
      // Find the connection to get the target user ID
      const connection = pendingSent.find(c => c.id === connectionId);
      if (!connection) return;
      
      const targetUserId = connection.requestedId;
      const response = await api.delete(`/connections/cancel/${targetUserId}`);
      
      if (response.data.success) {
        // Refresh data after successful action
        await fetchConnectionData();
      }
    } catch (error) {
      console.error('Error canceling request:', error);
      alert('Failed to cancel request. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMessage = (userId, userName) => {
    // TODO: Implement messaging functionality
    alert(`Message functionality coming soon! You wanted to message ${userName}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const getOtherUser = (connection) => {
    // Return the other user in the connection (not the current user)
    const currentUserId = user?.id;
    if (connection.requesterId !== currentUserId) {
      return {
        id: connection.requesterId,
        name: connection.requesterName,
        email: connection.requesterEmail
      };
    } else {
      return {
        id: connection.requestedId,
        name: connection.requestedName,
        email: connection.requestedEmail
      };
    }
  };

  const renderConnectionCard = (connection, type) => {
    const otherUser = getOtherUser(connection);
    const isLoading = actionLoading === connection.id;

    return (
      <div key={connection.id} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
        {/* User Info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.name}&backgroundColor=random`}
              alt={otherUser.name}
              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
            />
            {type === 'connected' && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{otherUser.name}</h3>
            <p className="text-sm text-slate-600">{otherUser.email}</p>
            {connection.createdAt && (
              <p className="text-xs text-slate-500">
                {type === 'received' ? 'Sent' : type === 'sent' ? 'Requested' : 'Connected'} {new Date(connection.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {type === 'received' && (
            <>
              <button
                onClick={() => handleAcceptRequest(connection.id)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Accept
              </button>
              <button
                onClick={() => handleRejectRequest(connection.id)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Reject
              </button>
            </>
          )}

          {type === 'sent' && (
            <button
              onClick={() => handleCancelRequest(connection.id)}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserX className="w-4 h-4" />
              )}
              Cancel Request
            </button>
          )}

          {type === 'connected' && (
            <button
              onClick={() => handleMessage(otherUser.id, otherUser.name)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar isAuthenticated={true} user={user} onLogout={handleLogout} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            My Connections
          </h1>
          <p className="text-xl text-slate-600">
            Manage your roommate connections and requests
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('received')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'received'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Received Requests
                  {pendingReceived.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingReceived.length}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('sent')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'sent'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Sent Requests
                  {pendingSent.length > 0 && (
                    <span className="bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingSent.length}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('connected')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'connected'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Connected
                  {connections.length > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {connections.length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'received' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Pending Requests ({pendingReceived.length})
                </h2>
                {pendingReceived.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No pending requests</h3>
                    <p className="text-slate-600">You don't have any pending connection requests.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingReceived.map(connection => renderConnectionCard(connection, 'received'))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sent' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Sent Requests ({pendingSent.length})
                </h2>
                {pendingSent.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No sent requests</h3>
                    <p className="text-slate-600">You haven't sent any connection requests yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingSent.map(connection => renderConnectionCard(connection, 'sent'))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'connected' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Connected Roommates ({connections.length})
                </h2>
                {connections.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No connections yet</h3>
                    <p className="text-slate-600">Start connecting with potential roommates to see them here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {connections.map(connection => renderConnectionCard(connection, 'connected'))}
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