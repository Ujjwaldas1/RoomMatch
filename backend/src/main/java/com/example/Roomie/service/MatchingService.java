package com.example.Roomie.service;

import com.example.Roomie.entity.UserPreferences;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MatchingService {

    public static record MatchResult(double overallScore, boolean isCompatible) {}

    private static final int DEFAULT_WEIGHT = 3;

    /**
     * Calculates the mutual compatibility match result between two users.
     * Checks deal-breakers symmetrically. If any deal-breaker is violated,
     * returns a score of 0.0 and isCompatible = false.
     *
     * @param self      The current user's preferences
     * @param candidate The potential roommate's preferences
     * @return MatchResult containing the mutual score (0-100) and compatibility status
     */
    public MatchResult calculateMatch(UserPreferences self, UserPreferences candidate) {
        if (self == null || candidate == null) {
            return new MatchResult(0.0, false);
        }

        // 1. Check Deal-Breakers (Symmetric Check)
        if (violatesDealBreakers(self, candidate) || violatesDealBreakers(candidate, self)) {
            return new MatchResult(0.0, false);
        }

        // 2. Compute Directional Scores (Weighted sum from each user's perspective)
        double scoreSelfToCand = computeDirectionalScore(self, candidate);
        double scoreCandToSelf = computeDirectionalScore(candidate, self);

        // 3. Mutual Score (Simple average)
        double mutualScore = (scoreSelfToCand + scoreCandToSelf) / 2.0;

        // Round to nearest integer or 1 decimal place for display
        double roundedScore = Math.round(mutualScore * 10.0) / 10.0;

        return new MatchResult(roundedScore, true);
    }

    /**
     * Calculates the directional weighted compatibility score of the candidate
     * from the self user's perspective.
     *
     * @param self      The user whose weights and preferences are evaluated
     * @param candidate The candidate roommate being compared
     * @return Score between 0.0 and 100.0
     */
    public double computeDirectionalScore(UserPreferences self, UserPreferences candidate) {
        double weightedSum = 0.0;
        double weightTotal = 0.0;

        // Cleanliness
        double cleanlinessScore = getCleanlinessScore(self.getCleanliness(), candidate.getCleanliness());
        double cleanlinessWeight = getWeightOrDefault(self.getCleanlinessWeight());
        weightedSum += cleanlinessScore * cleanlinessWeight;
        weightTotal += cleanlinessWeight;

        // Noise Level
        double noiseScore = getNoiseScore(self.getNoiseLevel(), candidate.getNoiseLevel());
        double noiseWeight = getWeightOrDefault(self.getNoiseWeight());
        weightedSum += noiseScore * noiseWeight;
        weightTotal += noiseWeight;

        // Social Level
        double socialScore = getSocialScore(self.getSocialLevel(), candidate.getSocialLevel());
        double socialWeight = getWeightOrDefault(self.getSocialWeight());
        weightedSum += socialScore * socialWeight;
        weightTotal += socialWeight;

        // Study Habits
        double studyScore = getStudyScore(self.getStudyHabits(), candidate.getStudyHabits());
        double studyWeight = getWeightOrDefault(self.getStudyWeight());
        weightedSum += studyScore * studyWeight;
        weightTotal += studyWeight;

        // Sleep Schedule
        double sleepScore = getSleepScore(self.getSleepSchedule(), candidate.getSleepSchedule());
        double sleepWeight = getWeightOrDefault(self.getSleepWeight());
        weightedSum += sleepScore * sleepWeight;
        weightTotal += sleepWeight;

        // Interests (Jaccard Score)
        Double interestsScore = getJaccardScore(self.getInterests(), candidate.getInterests());
        if (interestsScore != null) {
            double interestsWeight = getWeightOrDefault(self.getInterestsWeight());
            weightedSum += interestsScore * interestsWeight;
            weightTotal += interestsWeight;
        }

        // Hobbies (Jaccard Score)
        Double hobbiesScore = getJaccardScore(self.getHobbies(), candidate.getHobbies());
        if (hobbiesScore != null) {
            double hobbiesWeight = getWeightOrDefault(self.getHobbiesWeight());
            weightedSum += hobbiesScore * hobbiesWeight;
            weightTotal += hobbiesWeight;
        }

        if (weightTotal == 0.0) {
            return 0.0;
        }

        return (weightedSum / weightTotal) * 100.0;
    }

    /**
     * Checks if the candidate violates any of the self user's deal-breakers.
     */
    private boolean violatesDealBreakers(UserPreferences self, UserPreferences candidate) {
        if (self.getDealBreakers() == null || self.getDealBreakers().isEmpty()) {
            return false;
        }

        String[] dealBreakersArray = self.getDealBreakers().split(",");
        for (String db : dealBreakersArray) {
            switch (db.trim().toLowerCase()) {
                case "no-smoking":
                    if (candidate.getSmoking() != null && !"no".equalsIgnoreCase(candidate.getSmoking().trim())) {
                        return true;
                    }
                    break;
                case "no-pets":
                    if (candidate.getPets() != null && !"no".equalsIgnoreCase(candidate.getPets().trim())) {
                        return true;
                    }
                    break;
                case "strict-cleanliness":
                    String cleanliness = candidate.getCleanliness();
                    if (cleanliness == null || (!"clean".equalsIgnoreCase(cleanliness.trim()) && !"very-clean".equalsIgnoreCase(cleanliness.trim()))) {
                        return true;
                    }
                    break;
                case "quiet-only":
                    String noise = candidate.getNoiseLevel();
                    if (noise == null || (!"quiet".equalsIgnoreCase(noise.trim()) && !"very-quiet".equalsIgnoreCase(noise.trim()))) {
                        return true;
                    }
                    break;
            }
        }
        return false;
    }

    private double getCleanlinessScore(String selfVal, String candVal) {
        if (selfVal == null || candVal == null || selfVal.isEmpty() || candVal.isEmpty()) {
            return 0.5; // Neutral default similarity if unpopulated
        }
        int selfRank = mapCleanliness(selfVal);
        int candRank = mapCleanliness(candVal);
        return 1.0 - (Math.abs(selfRank - candRank) / 3.0);
    }

    private double getNoiseScore(String selfVal, String candVal) {
        if (selfVal == null || candVal == null || selfVal.isEmpty() || candVal.isEmpty()) {
            return 0.5;
        }
        int selfRank = mapNoise(selfVal);
        int candRank = mapNoise(candVal);
        return 1.0 - (Math.abs(selfRank - candRank) / 3.0);
    }

    private double getSocialScore(String selfVal, String candVal) {
        if (selfVal == null || candVal == null || selfVal.isEmpty() || candVal.isEmpty()) {
            return 0.5;
        }
        int selfRank = mapSocial(selfVal);
        int candRank = mapSocial(candVal);
        return 1.0 - (Math.abs(selfRank - candRank) / 2.0);
    }

    private double getStudyScore(String selfVal, String candVal) {
        if (selfVal == null || candVal == null || selfVal.isEmpty() || candVal.isEmpty()) {
            return 0.5;
        }
        int selfRank = mapStudy(selfVal);
        int candRank = mapStudy(candVal);
        return 1.0 - (Math.abs(selfRank - candRank) / 2.0);
    }

    private double getSleepScore(String selfVal, String candVal) {
        if (selfVal == null || candVal == null || selfVal.isEmpty() || candVal.isEmpty()) {
            return 0.5;
        }
        if (selfVal.equalsIgnoreCase(candVal)) {
            return 1.0;
        }
        if ("flexible".equalsIgnoreCase(selfVal) || "flexible".equalsIgnoreCase(candVal)) {
            return 0.8;
        }
        return 0.0; // opposite (early-bird vs night-owl)
    }

    private Double getJaccardScore(String listA, String listB) {
        if ((listA == null || listA.isEmpty()) && (listB == null || listB.isEmpty())) {
            return null; // Both empty -> ignore category weight in calculations
        }

        Set<String> setA = parseSet(listA);
        Set<String> setB = parseSet(listB);

        if (setA.isEmpty() || setB.isEmpty()) {
            return 0.0;
        }

        Set<String> intersection = new HashSet<>(setA);
        intersection.retainAll(setB);

        Set<String> union = new HashSet<>(setA);
        union.addAll(setB);

        return (double) intersection.size() / union.size();
    }

    private Set<String> parseSet(String rawStr) {
        if (rawStr == null || rawStr.isEmpty()) {
            return Collections.emptySet();
        }
        Set<String> set = new HashSet<>();
        for (String item : rawStr.split(",")) {
            String trimmed = item.trim().toLowerCase();
            if (!trimmed.isEmpty()) {
                set.add(trimmed);
            }
        }
        return set;
    }

    private int mapCleanliness(String val) {
        return switch (val.trim().toLowerCase()) {
            case "very-clean" -> 3;
            case "clean" -> 2;
            case "moderate" -> 1;
            case "relaxed" -> 0;
            default -> 1; // default to moderate
        };
    }

    private int mapNoise(String val) {
        return switch (val.trim().toLowerCase()) {
            case "very-quiet" -> 3;
            case "quiet" -> 2;
            case "moderate" -> 1;
            case "loud" -> 0;
            default -> 1;
        };
    }

    private int mapSocial(String val) {
        return switch (val.trim().toLowerCase()) {
            case "extrovert" -> 2;
            case "ambivert" -> 1;
            case "introvert" -> 0;
            default -> 1;
        };
    }

    private int mapStudy(String val) {
        return switch (val.trim().toLowerCase()) {
            case "intensive" -> 2;
            case "moderate" -> 1;
            case "light" -> 0;
            default -> 1;
        };
    }

    private int getWeightOrDefault(Integer weight) {
        return (weight != null) ? weight : DEFAULT_WEIGHT;
    }
}
