package com.example.Roomie.controller;

import com.example.Roomie.entity.User;
import com.example.Roomie.entity.UserPreferences;
import com.example.Roomie.repository.UserRepository;
import com.example.Roomie.repository.UserPreferencesRepository;
import com.example.Roomie.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/users")

public class UserController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserPreferencesRepository userPreferencesRepository;
    
    @Autowired
    private JwtService jwtService;

    @GetMapping("")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers(HttpServletRequest request) {
        try {
            // ✅ Extract user email from JWT
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(null);
            }
            String token = authHeader.substring(7);
            String email = jwtService.extractUsername(token);

            User currentUser = userRepository.findByEmail(email);
            if (currentUser == null) {
                return ResponseEntity.status(404).body(null);
            }

            // ✅ Fetch all other users except the logged-in one
            List<User> users = userRepository.findByIdNot(currentUser.getId());

            List<Map<String, Object>> usersWithPreferences = new ArrayList<>();

            for (User user : users) {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("name", user.getName());
                userMap.put("email", user.getEmail());
                userMap.put("university", user.getUniversity());
                userMap.put("course", user.getCourse());
                userMap.put("major", user.getMajor());
                userMap.put("year", user.getYear());
                userMap.put("phone", user.getPhone());
                userMap.put("bio", user.getBio());

                // ✅ Attach preferences
                Optional<UserPreferences> userPrefsOpt = userPreferencesRepository.findByUser(user);
                if (userPrefsOpt.isPresent()) {
                    UserPreferences prefs = userPrefsOpt.get();
                    Map<String, Object> preferences = new HashMap<>();
                    preferences.put("cleanliness", prefs.getCleanliness());
                    preferences.put("noiseLevel", prefs.getNoiseLevel());
                    preferences.put("socialLevel", prefs.getSocialLevel());
                    preferences.put("studyHabits", prefs.getStudyHabits());
                    preferences.put("sleepSchedule", prefs.getSleepSchedule());
                    preferences.put("partying", prefs.getPartying());
                    preferences.put("pets", prefs.getPets());
                    preferences.put("smoking", prefs.getSmoking());
                    preferences.put("budget", prefs.getBudget());
                    preferences.put("location", prefs.getLocation());
                    preferences.put("roomType", prefs.getRoomType());
                    preferences.put("leaseLength", prefs.getLeaseLength());
                    preferences.put("bio", prefs.getBio());

                    preferences.put("interests", prefs.getInterests() != null ?
                            Arrays.stream(prefs.getInterests().split(","))
                                    .filter(s -> !s.trim().isEmpty())
                                    .collect(Collectors.toList()) : List.of());

                    preferences.put("hobbies", prefs.getHobbies() != null ?
                            Arrays.stream(prefs.getHobbies().split(","))
                                    .filter(s -> !s.trim().isEmpty())
                                    .collect(Collectors.toList()) : List.of());

                    preferences.put("dealBreakers", prefs.getDealBreakers() != null ?
                            Arrays.stream(prefs.getDealBreakers().split(","))
                                    .filter(s -> !s.trim().isEmpty())
                                    .collect(Collectors.toList()) : List.of());

                    userMap.put("preferences", preferences);
                } else {
                    userMap.put("preferences", null);
                }

                usersWithPreferences.add(userMap);
            }

            System.out.println("Returning " + usersWithPreferences.size() + " users with preferences");
            return ResponseEntity.ok(usersWithPreferences);

        } catch (Exception e) {
            System.err.println("Error fetching users: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    
    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUserProfile(HttpServletRequest request) {
        try {
            // Extract user from JWT token
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Authorization header missing or invalid");
            }
            
            String token = authHeader.substring(7);
            String email = jwtService.extractUsername(token);
            
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }
            
            // Get user preferences
            Optional<UserPreferences> userPrefsOpt = userPreferencesRepository.findByUser(user);
            
            // Build response with user data and preferences
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("university", user.getUniversity());
            response.put("course", user.getCourse());
            response.put("major", user.getMajor());
            response.put("year", user.getYear());
            response.put("phone", user.getPhone());
            response.put("bio", user.getBio());
            
            if (userPrefsOpt.isPresent()) {
                UserPreferences prefs = userPrefsOpt.get();
                Map<String, Object> preferences = new HashMap<>();
                preferences.put("cleanliness", prefs.getCleanliness());
                preferences.put("noiseLevel", prefs.getNoiseLevel());
                preferences.put("socialLevel", prefs.getSocialLevel());
                preferences.put("studyHabits", prefs.getStudyHabits());
                preferences.put("sleepSchedule", prefs.getSleepSchedule());
                preferences.put("partying", prefs.getPartying());
                preferences.put("pets", prefs.getPets());
                preferences.put("smoking", prefs.getSmoking());
                preferences.put("budget", prefs.getBudget());
                preferences.put("location", prefs.getLocation());
                preferences.put("roomType", prefs.getRoomType());
                preferences.put("leaseLength", prefs.getLeaseLength());
                preferences.put("bio", prefs.getBio());
                
                // Convert comma-separated strings to arrays
                preferences.put("interests", prefs.getInterests() != null ? 
                    Arrays.asList(prefs.getInterests().split(",")).stream()
                        .filter(s -> !s.trim().isEmpty())
                        .collect(Collectors.toList()) : List.of());
                        
                preferences.put("hobbies", prefs.getHobbies() != null ? 
                    Arrays.asList(prefs.getHobbies().split(",")).stream()
                        .filter(s -> !s.trim().isEmpty())
                        .collect(Collectors.toList()) : List.of());
                        
                preferences.put("dealBreakers", prefs.getDealBreakers() != null ? 
                    Arrays.asList(prefs.getDealBreakers().split(",")).stream()
                        .filter(s -> !s.trim().isEmpty())
                        .collect(Collectors.toList()) : List.of());
                
                response.put("preferences", preferences);
            } else {
                response.put("preferences", null);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error fetching user profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching profile: " + e.getMessage());
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateCurrentUserProfile(@RequestBody Map<String, Object> profileData, HttpServletRequest request) {
        try {
            // Extract user from JWT token
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Authorization header missing or invalid");
            }
            
            String token = authHeader.substring(7);
            String email = jwtService.extractUsername(token);
            
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }
            
            // Update user basic information
            if (profileData.containsKey("name")) {
                user.setName((String) profileData.get("name"));
            }
            if (profileData.containsKey("university")) {
                user.setUniversity((String) profileData.get("university"));
            }
            if (profileData.containsKey("course")) {
                user.setCourse((String) profileData.get("course"));
            }
            if (profileData.containsKey("major")) {
                user.setMajor((String) profileData.get("major"));
            }
            if (profileData.containsKey("year")) {
                user.setYear((String) profileData.get("year"));
            }
            if (profileData.containsKey("phone")) {
                user.setPhone((String) profileData.get("phone"));
            }
            if (profileData.containsKey("bio")) {
                user.setBio((String) profileData.get("bio"));
            }
            
            // Save updated user
            userRepository.save(user);
            
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully!"));
            
        } catch (Exception e) {
            System.err.println("Error updating user profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating profile: " + e.getMessage());
        }
    }

    // You can add more endpoints here later
    // @GetMapping("/{id}")
    // @GetMapping("/matches")
    // etc.
}