package com.example.Roomie.controller;

import com.example.Roomie.entity.User;
import com.example.Roomie.entity.UserPreferences;
import com.example.Roomie.repository.UserRepository;
import com.example.Roomie.repository.UserPreferencesRepository;
import com.example.Roomie.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.Arrays;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class PreferencesController {

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserPreferencesRepository userPreferencesRepository;

    @PostMapping("/preferences")
    public ResponseEntity<?> savePreferences(@RequestBody Map<String, Object> preferences, HttpServletRequest request) {
        try {
            System.out.println("=== PREFERENCES ENDPOINT HIT ===");
            
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
            
            // Find or create user preferences
            UserPreferences userPrefs = userPreferencesRepository.findByUser(user)
                    .orElse(new UserPreferences(user));
            
            // Map preferences from request body
            if (preferences.containsKey("cleanliness")) {
                userPrefs.setCleanliness((String) preferences.get("cleanliness"));
            }
            if (preferences.containsKey("noiseLevel")) {
                userPrefs.setNoiseLevel((String) preferences.get("noiseLevel"));
            }
            if (preferences.containsKey("socialLevel")) {
                userPrefs.setSocialLevel((String) preferences.get("socialLevel"));
            }
            if (preferences.containsKey("studyHabits")) {
                userPrefs.setStudyHabits((String) preferences.get("studyHabits"));
            }
            if (preferences.containsKey("sleepSchedule")) {
                userPrefs.setSleepSchedule((String) preferences.get("sleepSchedule"));
            }
            if (preferences.containsKey("partying")) {
                userPrefs.setPartying((String) preferences.get("partying"));
            }
            if (preferences.containsKey("pets")) {
                userPrefs.setPets((String) preferences.get("pets"));
            }
            if (preferences.containsKey("smoking")) {
                userPrefs.setSmoking((String) preferences.get("smoking"));
            }
            if (preferences.containsKey("budget")) {
                userPrefs.setBudget((String) preferences.get("budget"));
            }
            if (preferences.containsKey("location")) {
                userPrefs.setLocation((String) preferences.get("location"));
            }
            if (preferences.containsKey("roomType")) {
                userPrefs.setRoomType((String) preferences.get("roomType"));
            }
            if (preferences.containsKey("leaseLength")) {
                userPrefs.setLeaseLength((String) preferences.get("leaseLength"));
            }
            if (preferences.containsKey("bio")) {
                userPrefs.setBio((String) preferences.get("bio"));
            }
            
            // Handle interests (convert from List to comma-separated string)
            if (preferences.containsKey("interests")) {
                Object interestsObj = preferences.get("interests");
                if (interestsObj instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> interestsList = (List<String>) interestsObj;
                    String interestsString = String.join(",", interestsList);
                    userPrefs.setInterests(interestsString);
                }
            }
            
            // Handle hobbies (convert from List to comma-separated string)
            if (preferences.containsKey("hobbies")) {
                Object hobbiesObj = preferences.get("hobbies");
                if (hobbiesObj instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> hobbiesList = (List<String>) hobbiesObj;
                    String hobbiesString = String.join(",", hobbiesList);
                    userPrefs.setHobbies(hobbiesString);
                }
            }
            
            // Handle deal breakers (convert from List to comma-separated string)
            if (preferences.containsKey("dealBreakers")) {
                Object dealBreakersObj = preferences.get("dealBreakers");
                if (dealBreakersObj instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> dealBreakersList = (List<String>) dealBreakersObj;
                    String dealBreakersString = String.join(",", dealBreakersList);
                    userPrefs.setDealBreakers(dealBreakersString);
                }
            }
            
            // Save preferences
            userPreferencesRepository.save(userPrefs);
            
            System.out.println("Preferences saved successfully for user: " + email);
            return ResponseEntity.ok(Map.of("message", "Preferences saved successfully!"));
            
        } catch (Exception e) {
            System.err.println("Error saving preferences: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving preferences: " + e.getMessage());
        }
    }
    
    @GetMapping("/preferences")
    public ResponseEntity<?> getPreferences(HttpServletRequest request) {
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
            
            // Find user preferences
            Optional<UserPreferences> userPrefsOpt = userPreferencesRepository.findByUser(user);
            if (!userPrefsOpt.isPresent()) {
                return ResponseEntity.ok(Map.of("message", "No preferences found"));
            }
            
            UserPreferences userPrefs = userPrefsOpt.get();
            
            // Convert preferences to response format
            Map<String, Object> response = new HashMap<>();
            response.put("cleanliness", userPrefs.getCleanliness() != null ? userPrefs.getCleanliness() : "");
            response.put("noiseLevel", userPrefs.getNoiseLevel() != null ? userPrefs.getNoiseLevel() : "");
            response.put("socialLevel", userPrefs.getSocialLevel() != null ? userPrefs.getSocialLevel() : "");
            response.put("studyHabits", userPrefs.getStudyHabits() != null ? userPrefs.getStudyHabits() : "");
            response.put("sleepSchedule", userPrefs.getSleepSchedule() != null ? userPrefs.getSleepSchedule() : "");
            response.put("partying", userPrefs.getPartying() != null ? userPrefs.getPartying() : "");
            response.put("pets", userPrefs.getPets() != null ? userPrefs.getPets() : "");
            response.put("smoking", userPrefs.getSmoking() != null ? userPrefs.getSmoking() : "");
            response.put("budget", userPrefs.getBudget() != null ? userPrefs.getBudget() : "");
            response.put("location", userPrefs.getLocation() != null ? userPrefs.getLocation() : "");
            response.put("roomType", userPrefs.getRoomType() != null ? userPrefs.getRoomType() : "");
            response.put("leaseLength", userPrefs.getLeaseLength() != null ? userPrefs.getLeaseLength() : "");
            response.put("bio", userPrefs.getBio() != null ? userPrefs.getBio() : "");
            response.put("interests", userPrefs.getInterests() != null ? 
                Arrays.asList(userPrefs.getInterests().split(",")).stream()
                    .filter(s -> !s.trim().isEmpty())
                    .collect(Collectors.toList()) : List.of());
            response.put("hobbies", userPrefs.getHobbies() != null ? 
                Arrays.asList(userPrefs.getHobbies().split(",")).stream()
                    .filter(s -> !s.trim().isEmpty())
                    .collect(Collectors.toList()) : List.of());
            response.put("dealBreakers", userPrefs.getDealBreakers() != null ? 
                Arrays.asList(userPrefs.getDealBreakers().split(",")).stream()
                    .filter(s -> !s.trim().isEmpty())
                    .collect(Collectors.toList()) : List.of());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error fetching preferences: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching preferences: " + e.getMessage());
        }
    }
}