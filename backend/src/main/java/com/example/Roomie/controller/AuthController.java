package com.example.Roomie.controller; // TODO: Change this to your package!

import com.example.Roomie.dto.LoginRequest;
import com.example.Roomie.entity.User;
import com.example.Roomie.repository.UserRepository;
import com.example.Roomie.service.JwtService;
import com.example.Roomie.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Inject the JwtService and AuthenticationManager
    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody User newUser) {
        User existingUser = userRepository.findByEmail(newUser.getEmail());
        if (existingUser != null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Email already exists!");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        String encodedPassword = passwordEncoder.encode(newUser.getPassword());
        newUser.setPassword(encodedPassword);
        User savedUser = userRepository.save(newUser);

        // Generate token for automatic login after registration
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtService.generateTokenWithUserId(userDetails, savedUser.getId());

        // Return JSON response with token and user data (same format as login)
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);

        Map<String, Object> userData = new HashMap<>();
        userData.put("email", savedUser.getEmail());
        userData.put("name", savedUser.getName());
        userData.put("university", savedUser.getUniversity());
        userData.put("course", savedUser.getCourse());
        response.put("user", userData);
        response.put("message", "User registered successfully!");

        return ResponseEntity.ok(response);
    }

    // NEW LOGIN ENDPOINT
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login attempt for email: " + loginRequest.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            if (authentication.isAuthenticated()) {
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginRequest.getEmail());
                
                // Get the full user details from database
                User user = userRepository.findByEmail(loginRequest.getEmail());
                
                String token = jwtService.generateTokenWithUserId(userDetails, user.getId());

                // Return JSON response with token and user data
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);

                // Use HashMap to avoid NullPointerException with Map.of()
                Map<String, Object> userData = new HashMap<>();
                userData.put("email", user.getEmail());
                userData.put("name", user.getName());
                userData.put("university", user.getUniversity());
                userData.put("course", user.getCourse());
                response.put("user", userData);

                return ResponseEntity.ok(response);
            } else {
                throw new UsernameNotFoundException("Invalid email or password.");
            }
        } catch (Exception e) {
            System.out.println("Authentication error: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid email or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @GetMapping("/profile")
    public String protectedEndpoint() {
        return "This is a protected endpoint! Only accessible with a valid JWT token.";
    }
}