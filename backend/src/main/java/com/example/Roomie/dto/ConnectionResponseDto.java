package com.example.Roomie.dto;

import com.example.Roomie.entity.Connection;
import java.time.LocalDateTime;

public class ConnectionResponseDto {
    
    private Long id;
    private Long requesterId;
    private String requesterName;
    private String requesterEmail;
    private Long requestedId;
    private String requestedName;
    private String requestedEmail;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public ConnectionResponseDto() {}

    public ConnectionResponseDto(Connection connection) {
        this.id = connection.getId();
        this.requesterId = connection.getRequester().getId();
        this.requesterName = connection.getRequester().getName();
        this.requesterEmail = connection.getRequester().getEmail();
        this.requestedId = connection.getRequested().getId();
        this.requestedName = connection.getRequested().getName();
        this.requestedEmail = connection.getRequested().getEmail();
        this.status = connection.getStatus().toString();
        this.createdAt = connection.getCreatedAt();
        this.updatedAt = connection.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(Long requesterId) {
        this.requesterId = requesterId;
    }

    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }

    public String getRequesterEmail() {
        return requesterEmail;
    }

    public void setRequesterEmail(String requesterEmail) {
        this.requesterEmail = requesterEmail;
    }

    public Long getRequestedId() {
        return requestedId;
    }

    public void setRequestedId(Long requestedId) {
        this.requestedId = requestedId;
    }

    public String getRequestedName() {
        return requestedName;
    }

    public void setRequestedName(String requestedName) {
        this.requestedName = requestedName;
    }

    public String getRequestedEmail() {
        return requestedEmail;
    }

    public void setRequestedEmail(String requestedEmail) {
        this.requestedEmail = requestedEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
}