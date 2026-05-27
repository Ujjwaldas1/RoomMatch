package com.example.Roomie.repository;

import com.example.Roomie.entity.Connection;
import com.example.Roomie.entity.Connection.ConnectionStatus;
import com.example.Roomie.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    // Find connection between two users (regardless of who initiated)
    @Query("SELECT c FROM Connection c WHERE " +
           "(c.requester.id = :userId1 AND c.requested.id = :userId2) OR " +
           "(c.requester.id = :userId2 AND c.requested.id = :userId1)")
    Optional<Connection> findConnectionBetweenUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    // Find all connections for a user (as requester or requested)
    @Query("SELECT c FROM Connection c WHERE " +
           "(c.requester.id = :userId OR c.requested.id = :userId)")
    List<Connection> findConnectionsByUser(@Param("userId") Long userId);

    // Find all accepted connections for a user
    @Query("SELECT c FROM Connection c WHERE " +
           "(c.requester.id = :userId OR c.requested.id = :userId) AND " +
           "c.status = :status")
    List<Connection> findConnectionsByUserAndStatus(@Param("userId") Long userId, @Param("status") ConnectionStatus status);

    // Find pending requests sent by a user
    @Query("SELECT c FROM Connection c WHERE c.requester.id = :userId AND c.status = 'PENDING'")
    List<Connection> findPendingRequestsByRequester(@Param("userId") Long userId);

    // Find pending requests received by a user
    @Query("SELECT c FROM Connection c WHERE c.requested.id = :userId AND c.status = 'PENDING'")
    List<Connection> findPendingRequestsByRequested(@Param("userId") Long userId);

    // Check if users are connected
    @Query("SELECT COUNT(c) > 0 FROM Connection c WHERE " +
           "((c.requester.id = :userId1 AND c.requested.id = :userId2) OR " +
           "(c.requester.id = :userId2 AND c.requested.id = :userId1)) AND " +
           "c.status = 'ACCEPTED'")
    boolean areUsersConnected(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    // Check if there's a pending request between users
    @Query("SELECT COUNT(c) > 0 FROM Connection c WHERE " +
           "((c.requester.id = :userId1 AND c.requested.id = :userId2) OR " +
           "(c.requester.id = :userId2 AND c.requested.id = :userId1)) AND " +
           "c.status = 'PENDING'")
    boolean hasPendingRequest(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    // Find all users connected to a specific user
    @Query("SELECT CASE " +
           "WHEN c.requester.id = :userId THEN c.requested " +
           "ELSE c.requester END " +
           "FROM Connection c WHERE " +
           "(c.requester.id = :userId OR c.requested.id = :userId) AND " +
           "c.status = 'ACCEPTED'")
    List<User> findConnectedUsers(@Param("userId") Long userId);
}