package com.example.Roomie.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "connections",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"requester_id", "requested_id"})
       })
public class Connection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester; // User who sent the connection request

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_id", nullable = false)
    private User requested; // User who received the connection request

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConnectionStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ConnectionStatus {
        PENDING,    // Request sent, waiting for response
        ACCEPTED,   // Request accepted, users are connected
        REJECTED,   // Request rejected
        CANCELLED   // Request cancelled by requester
    }

    // Constructors
    public Connection() {
        this.createdAt = LocalDateTime.now();
    }

    public Connection(User requester, User requested) {
        this();
        this.requester = requester;
        this.requested = requested;
        this.status = ConnectionStatus.PENDING;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getRequester() {
        return requester;
    }

    public void setRequester(User requester) {
        this.requester = requester;
    }

    public User getRequested() {
        return requested;
    }

    public void setRequested(User requested) {
        this.requested = requested;
    }

    public ConnectionStatus getStatus() {
        return status;
    }

    public void setStatus(ConnectionStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Helper methods
    public boolean isConnected() {
        return status == ConnectionStatus.ACCEPTED;
    }

    public boolean isPending() {
        return status == ConnectionStatus.PENDING;
    }

    public boolean involves(User user) {
        return requester.getId().equals(user.getId()) || requested.getId().equals(user.getId());
    }

    public User getOtherUser(User currentUser) {
        if (requester.getId().equals(currentUser.getId())) {
            return requested;
        } else if (requested.getId().equals(currentUser.getId())) {
            return requester;
        }
        return null;
    }
}