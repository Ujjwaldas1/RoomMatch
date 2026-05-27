package com.example.Roomie.controller;

import com.example.Roomie.dto.ConnectionRequestDto;
import com.example.Roomie.dto.ConnectionResponseDto;
import com.example.Roomie.entity.Connection;
import com.example.Roomie.entity.User;
import com.example.Roomie.repository.UserRepository;
import com.example.Roomie.service.ConnectionService;
import com.example.Roomie.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend requests
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Send a connection request
     */
    @PostMapping("/request")
    public ResponseEntity<?> sendConnectionRequest(
            @Valid @RequestBody ConnectionRequestDto request,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            System.out.println("=== Connection Request Debug ===");
            System.out.println("Request userId: " + request.getUserId());
            System.out.println("Auth header: " + (authHeader != null ? "Bearer ***" : "null"));
            
            Long currentUserId = getCurrentUserId(authHeader);
            System.out.println("Current user ID: " + currentUserId);
            
            Connection connection = connectionService.sendConnectionRequest(
                currentUserId, 
                request.getUserId()
            );
            
            ConnectionResponseDto response = new ConnectionResponseDto(connection);
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("success", true);
            responseMap.put("message", "Connection request sent successfully");
            responseMap.put("connection", response);
            
            return ResponseEntity.ok(responseMap);
            
        } catch (Exception e) {
            System.err.println("Connection request error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Accept a connection request
     */
    @PostMapping("/accept/{connectionId}")
    public ResponseEntity<?> acceptConnectionRequest(
            @PathVariable Long connectionId,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            Long currentUserId = getCurrentUserId(authHeader);
            
            Connection connection = connectionService.acceptConnectionRequest(currentUserId, connectionId);
            ConnectionResponseDto response = new ConnectionResponseDto(connection);
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("success", true);
            responseMap.put("message", "Connection request accepted");
            responseMap.put("connection", response);
            
            return ResponseEntity.ok(responseMap);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Reject a connection request
     */
    @PostMapping("/reject/{connectionId}")
    public ResponseEntity<?> rejectConnectionRequest(
            @PathVariable Long connectionId,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            Long currentUserId = getCurrentUserId(authHeader);
            
            Connection connection = connectionService.rejectConnectionRequest(currentUserId, connectionId);
            ConnectionResponseDto response = new ConnectionResponseDto(connection);
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("success", true);
            responseMap.put("message", "Connection request rejected");
            responseMap.put("connection", response);
            
            return ResponseEntity.ok(responseMap);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Cancel a connection request
     */
    @DeleteMapping("/cancel/{userId}")
    public ResponseEntity<?> cancelConnectionRequest(
            @PathVariable String userId,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            Long currentUserId = getCurrentUserId(authHeader);
            
            connectionService.cancelConnectionRequest(currentUserId, userId);
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("success", true);
            responseMap.put("message", "Connection request cancelled");
            
            return ResponseEntity.ok(responseMap);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Remove/disconnect an existing connection
     */
    @DeleteMapping("/remove/{userId}")
    public ResponseEntity<?> removeConnection(
            @PathVariable String userId,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            Long currentUserId = getCurrentUserId(authHeader);
            
            connectionService.removeConnection(currentUserId, userId);
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("success", true);
            responseMap.put("message", "Connection removed successfully");
            
            return ResponseEntity.ok(responseMap);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get all connections for current user
     */
    @GetMapping("/my-connections")
    public ResponseEntity<?> getMyConnections(@RequestHeader("Authorization") String authHeader) {
        try {
            Long currentUserId = getCurrentUserId(authHeader);
            
            List<Connection> connections = connectionService.getUserConnections(currentUserId);
            List<ConnectionResponseDto> response = connections.stream()
                    .map(ConnectionResponseDto::new)
                    .collect(Collectors.toList());
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("success", true);
            responseMap.put("connections", response);
            
            return ResponseEntity.ok(responseMap);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get accepted connections for current user
     */
    @GetMapping("/accepted")
    public ResponseEntity<?> getAcceptedConnections(@RequestHeader("Authorization") String authHeader) {
        try {
            Long currentUserId = getCurrentUserId(authHeader);
            
            List<Connection> connections = connectionService.getUserAcceptedConnections(currentUserId);
            List<ConnectionResponseDto> response = connections.stream()
                    .map(ConnectionResponseDto::new)
                    .collect(Collectors.toList());
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("success", true);
            responseMap.put("connections", response);
            
            return ResponseEntity.ok(responseMap);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get pending received requests
     */
    @GetMapping("/pending/received")
    public ResponseEntity<?> getPendingReceivedRequests(@RequestHeader("Authorization") String authHeader) {
        try {
            Long currentUserId = getCurrentUserId(authHeader);
            
            List<Connection> connections = connectionService.getPendingReceivedRequests(currentUserId);
            List<ConnectionResponseDto> response = connections.stream()
                    .map(ConnectionResponseDto::new)
                    .collect(Collectors.toList());
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("success", true);
            responseMap.put("requests", response);
            
            return ResponseEntity.ok(responseMap);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get pending sent requests
     */
    @GetMapping("/pending/sent")
    public ResponseEntity<?> getPendingSentRequests(@RequestHeader("Authorization") String authHeader) {
        try {
            Long currentUserId = getCurrentUserId(authHeader);
            
            List<Connection> connections = connectionService.getPendingSentRequests(currentUserId);
            List<ConnectionResponseDto> response = connections.stream()
                    .map(ConnectionResponseDto::new)
                    .collect(Collectors.toList());
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("success", true);
            responseMap.put("requests", response);
            
            return ResponseEntity.ok(responseMap);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get connection status between current user and target user
     */
    @GetMapping("/status/{userId}")
    public ResponseEntity<?> getConnectionStatus(
            @PathVariable String userId,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            Long currentUserId = getCurrentUserId(authHeader);
            
            String status = connectionService.getConnectionStatus(currentUserId, userId);
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("success", true);
            responseMap.put("status", status);
            
            return ResponseEntity.ok(responseMap);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Helper method to extract user ID from JWT token
     */
    private Long getCurrentUserId(String authHeader) {
        System.out.println("=== getCurrentUserId Debug ===");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.err.println("Invalid authorization header: " + authHeader);
            throw new RuntimeException("Invalid authorization header");
        }
        
        String token = authHeader.substring(7);
        System.out.println("Token extracted, length: " + token.length());
        
        String email = jwtService.extractUsername(token);
        System.out.println("Email from token: " + email);
        
        if (email == null) {
            System.err.println("Invalid token - no email extracted");
            throw new RuntimeException("Invalid token");
        }
        
        // Try to get user ID from token first
        try {
            Long userIdFromToken = jwtService.extractUserId(token);
            System.out.println("User ID from token: " + userIdFromToken);
            if (userIdFromToken != null) {
                return userIdFromToken;
            }
        } catch (Exception e) {
            // Fall back to looking up by email if userId not in token
            System.out.println("User ID not found in token, looking up by email: " + email);
        }
        
        // Fallback: lookup user by email (for compatibility with old tokens)
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                System.err.println("User not found for email: " + email);
                throw new RuntimeException("User not found for email: " + email);
            }
            System.out.println("User found by email, ID: " + user.getId());
            return user.getId();
        } catch (Exception e) {
            System.err.println("Error looking up user by email: " + e.getMessage());
            throw new RuntimeException("User not found for email: " + email);
        }
    }
}