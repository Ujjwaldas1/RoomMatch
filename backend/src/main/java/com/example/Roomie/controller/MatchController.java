package com.example.Roomie.controller;

import com.example.Roomie.dto.MatchResultDto;
import com.example.Roomie.entity.Connection;
import com.example.Roomie.entity.User;
import com.example.Roomie.entity.UserPreferences;
import com.example.Roomie.repository.ConnectionRepository;
import com.example.Roomie.repository.UserPreferencesRepository;
import com.example.Roomie.repository.UserRepository;
import com.example.Roomie.service.JwtService;
import com.example.Roomie.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")

public class MatchController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPreferencesRepository userPreferencesRepository;

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/matches")
    public ResponseEntity<?> getMatches(@RequestHeader("Authorization") String authHeader) {
        try {
            // 1. Authenticate user from JWT token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token");
            }
            String token = authHeader.substring(7);
            String email = jwtService.extractUsername(token);
            User currentUser = userRepository.findByEmail(email);

            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            // 2. Load current user's preferences
            Optional<UserPreferences> selfPrefsOpt = userPreferencesRepository.findByUser(currentUser);
            if (selfPrefsOpt.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList()); // No preferences set yet
            }
            UserPreferences selfPrefs = selfPrefsOpt.get();

            // 3. Compute excluded user IDs
            Set<Long> excludedUserIds = getExcludedUserIds(currentUser.getId());

            // 4. Fetch all user preferences and filter candidates
            List<UserPreferences> allPrefs = userPreferencesRepository.findAll();
            List<MatchResultDto> matches = new ArrayList<>();

            for (UserPreferences candidatePrefs : allPrefs) {
                User candidateUser = candidatePrefs.getUser();
                if (candidateUser == null || excludedUserIds.contains(candidateUser.getId())) {
                    continue; // Skip self, accepted connections, and pending requests
                }

                // 5. Pass preferences to MatchingService
                MatchingService.MatchResult result = matchingService.calculateMatch(selfPrefs, candidatePrefs);

                if (result.isCompatible()) {
                    List<String> sharedInterests = calculateSharedInterests(selfPrefs, candidatePrefs);
                    matches.add(new MatchResultDto(
                        candidateUser.getId(),
                        candidateUser.getName(),
                        (int) Math.round(result.overallScore()),
                        sharedInterests
                    ));
                }
            }

            // 6. Sort matches by score descending
            matches.sort((a, b) -> Integer.compare(b.getCompatibilityScore(), a.getCompatibilityScore()));

            // 7. Limit to top 10 matches
            List<MatchResultDto> top10Matches = matches.stream()
                .limit(10)
                .collect(Collectors.toList());

            return ResponseEntity.ok(top10Matches);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving matches: " + e.getMessage());
        }
    }

    /**
     * Finds and compiles user IDs that are either already connected or have a pending request.
     */
    private Set<Long> getExcludedUserIds(Long currentUserId) {
        Set<Long> excluded = new HashSet<>();
        excluded.add(currentUserId); // Exclude self

        List<Connection> connections = connectionRepository.findConnectionsByUser(currentUserId);
        for (Connection conn : connections) {
            if (conn.getStatus() == Connection.ConnectionStatus.ACCEPTED || conn.getStatus() == Connection.ConnectionStatus.PENDING) {
                if (conn.getRequester().getId().equals(currentUserId)) {
                    excluded.add(conn.getRequested().getId());
                } else {
                    excluded.add(conn.getRequester().getId());
                }
            }
        }
        return excluded;
    }

    /**
     * Identifies case-insensitive matches in interests between the user and candidate.
     */
    private List<String> calculateSharedInterests(UserPreferences self, UserPreferences candidate) {
        if (self.getInterests() == null || candidate.getInterests() == null) {
            return Collections.emptyList();
        }

        Set<String> candidateInterests = parseInterestSet(candidate.getInterests());
        List<String> shared = new ArrayList<>();

        for (String item : self.getInterests().split(",")) {
            String trimmed = item.trim();
            if (!trimmed.isEmpty() && candidateInterests.contains(trimmed.toLowerCase())) {
                shared.add(trimmed);
            }
        }
        return shared;
    }

    private Set<String> parseInterestSet(String raw) {
        if (raw == null || raw.isEmpty()) {
            return Collections.emptySet();
        }
        Set<String> set = new HashSet<>();
        for (String item : raw.split(",")) {
            String trimmed = item.trim().toLowerCase();
            if (!trimmed.isEmpty()) {
                set.add(trimmed);
            }
        }
        return set;
    }
}
