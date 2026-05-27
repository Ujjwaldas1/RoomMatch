package com.example.Roomie.dto;

import jakarta.validation.constraints.NotNull;

public class ConnectionRequestDto {
    
    @NotNull(message = "User ID is required")
    private String userId; // Can be Long ID or String name depending on frontend implementation

    // Constructors
    public ConnectionRequestDto() {}

    public ConnectionRequestDto(String userId) {
        this.userId = userId;
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}