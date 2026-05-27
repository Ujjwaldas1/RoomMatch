package com.example.Roomie.service;

import com.example.Roomie.entity.Connection;
import com.example.Roomie.entity.Connection.ConnectionStatus;
import com.example.Roomie.entity.User;
import com.example.Roomie.repository.ConnectionRepository;
import com.example.Roomie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Send a connection request from one user to another
     */
    public Connection sendConnectionRequest(Long requesterId, String targetUserId) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Requester not found"));

        User requested = findUserByIdOrName(targetUserId);
        if (requested == null) {
            throw new RuntimeException("Target user not found: " + targetUserId);
        }

        // Check if users are trying to connect to themselves
        if (requester.getId().equals(requested.getId())) {
            throw new RuntimeException("Cannot send connection request to yourself");
        }

        // Check if connection already exists
        Optional<Connection> existingConnection = connectionRepository
                .findConnectionBetweenUsers(requester.getId(), requested.getId());

        if (existingConnection.isPresent()) {
            Connection existing = existingConnection.get();
            if (existing.getStatus() == ConnectionStatus.PENDING) {
                throw new RuntimeException("Connection request already pending");
            } else if (existing.getStatus() == ConnectionStatus.ACCEPTED) {
                throw new RuntimeException("Users are already connected");
            } else {
                // If rejected or cancelled, allow new request
                existing.setRequester(requester);
                existing.setRequested(requested);
                existing.setStatus(ConnectionStatus.PENDING);
                return connectionRepository.save(existing);
            }
        }

        // Create new connection request
        Connection connection = new Connection(requester, requested);
        return connectionRepository.save(connection);
    }

    /**
     * Accept a connection request
     */
    public Connection acceptConnectionRequest(Long userId, Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        // Verify user is the requested user and status is pending
        if (!connection.getRequested().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to accept this request");
        }

        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new RuntimeException("Connection request is not pending");
        }

        connection.setStatus(ConnectionStatus.ACCEPTED);
        return connectionRepository.save(connection);
    }

    /**
     * Reject a connection request
     */
    public Connection rejectConnectionRequest(Long userId, Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        // Verify user is the requested user and status is pending
        if (!connection.getRequested().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to reject this request");
        }

        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new RuntimeException("Connection request is not pending");
        }

        connection.setStatus(ConnectionStatus.REJECTED);
        return connectionRepository.save(connection);
    }

    /**
     * Cancel a connection request (by requester)
     */
    public void cancelConnectionRequest(Long userId, String targetUserId) {
        User targetUser = findUserByIdOrName(targetUserId);
        if (targetUser == null) {
            throw new RuntimeException("Target user not found: " + targetUserId);
        }

        Optional<Connection> connection = connectionRepository
                .findConnectionBetweenUsers(userId, targetUser.getId());

        if (connection.isEmpty()) {
            throw new RuntimeException("No connection found between users");
        }

        Connection conn = connection.get();
        
        // Verify user is the requester and status is pending
        if (!conn.getRequester().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to cancel this request");
        }

        if (conn.getStatus() != ConnectionStatus.PENDING) {
            throw new RuntimeException("Connection request is not pending");
        }

        conn.setStatus(ConnectionStatus.CANCELLED);
        connectionRepository.save(conn);
    }

    /**
     * Remove/disconnect an existing connection
     */
    public void removeConnection(Long userId, String targetUserId) {
        User targetUser = findUserByIdOrName(targetUserId);
        if (targetUser == null) {
            throw new RuntimeException("Target user not found: " + targetUserId);
        }

        Optional<Connection> connection = connectionRepository
                .findConnectionBetweenUsers(userId, targetUser.getId());

        if (connection.isEmpty()) {
            throw new RuntimeException("No connection found between users");
        }

        Connection conn = connection.get();
        
        // Verify user is part of the connection and it's accepted
        if (!conn.involves(userRepository.findById(userId).orElse(null))) {
            throw new RuntimeException("Not authorized to remove this connection");
        }

        if (conn.getStatus() != ConnectionStatus.ACCEPTED) {
            throw new RuntimeException("Users are not connected");
        }

        // Remove the connection
        connectionRepository.delete(conn);
    }

    /**
     * Get all connections for a user
     */
    public List<Connection> getUserConnections(Long userId) {
        return connectionRepository.findConnectionsByUser(userId);
    }

    /**
     * Get all accepted connections for a user
     */
    public List<Connection> getUserAcceptedConnections(Long userId) {
        return connectionRepository.findConnectionsByUserAndStatus(userId, ConnectionStatus.ACCEPTED);
    }

    /**
     * Get pending requests received by a user
     */
    public List<Connection> getPendingReceivedRequests(Long userId) {
        return connectionRepository.findPendingRequestsByRequested(userId);
    }

    /**
     * Get pending requests sent by a user
     */
    public List<Connection> getPendingSentRequests(Long userId) {
        return connectionRepository.findPendingRequestsByRequester(userId);
    }

    /**
     * Check if two users are connected
     */
    public boolean areUsersConnected(Long userId1, Long userId2) {
        return connectionRepository.areUsersConnected(userId1, userId2);
    }

    /**
     * Get connection status between two users
     */
    public String getConnectionStatus(Long userId1, String targetUserId) {
        User targetUser = findUserByIdOrName(targetUserId);
        if (targetUser == null) {
            return "none";
        }

        Optional<Connection> connection = connectionRepository
                .findConnectionBetweenUsers(userId1, targetUser.getId());

        if (connection.isEmpty()) {
            return "none";
        }

        return connection.get().getStatus().toString().toLowerCase();
    }

    /**
     * Helper method to find user by ID or name
     */
    private User findUserByIdOrName(String userIdOrName) {
        try {
            // Try to parse as Long ID first
            Long userId = Long.parseLong(userIdOrName);
            return userRepository.findById(userId).orElse(null);
        } catch (NumberFormatException e) {
            // If not a number, search by name
            return userRepository.findByName(userIdOrName).orElse(null);
        }
    }
}