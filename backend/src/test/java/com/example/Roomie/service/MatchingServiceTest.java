package com.example.Roomie.service;

import com.example.Roomie.entity.User;
import com.example.Roomie.entity.UserPreferences;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MatchingServiceTest {

    private MatchingService matchingService;

    @BeforeEach
    void setUp() {
        matchingService = new MatchingService();
    }

    @Test
    void whenProfilesIdentical_thenScoreIsOneHundred() {
        UserPreferences self = createBasePreferences();
        UserPreferences candidate = createBasePreferences();

        MatchingService.MatchResult result = matchingService.calculateMatch(self, candidate);

        assertTrue(result.isCompatible());
        assertEquals(100.0, result.overallScore(), 0.1);
    }

    @Test
    void whenProfilesOpposite_thenScoreIsLow() {
        UserPreferences self = new UserPreferences();
        self.setCleanliness("very-clean");
        self.setNoiseLevel("very-quiet");
        self.setSocialLevel("introvert");
        self.setStudyHabits("intensive");
        self.setSleepSchedule("early-bird");
        self.setSmoking("no");
        self.setPets("no");
        self.setInterests("gaming,coding");
        self.setHobbies("reading");

        UserPreferences candidate = new UserPreferences();
        candidate.setCleanliness("relaxed");
        candidate.setNoiseLevel("loud");
        candidate.setSocialLevel("extrovert");
        candidate.setStudyHabits("light");
        candidate.setSleepSchedule("night-owl");
        candidate.setSmoking("yes");
        candidate.setPets("yes");
        candidate.setInterests("sports,music");
        candidate.setHobbies("travel");

        MatchingService.MatchResult result = matchingService.calculateMatch(self, candidate);

        assertTrue(result.isCompatible()); // No deal-breakers specified
        assertTrue(result.overallScore() < 30.0, "Score should be low for opposite profiles but was " + result.overallScore());
    }

    @Test
    void whenSmokingDealBreakerTriggered_thenIncompatible() {
        UserPreferences self = createBasePreferences();
        self.setDealBreakers("no-smoking");

        UserPreferences candidate = createBasePreferences();
        candidate.setSmoking("yes");

        MatchingService.MatchResult result = matchingService.calculateMatch(self, candidate);

        assertFalse(result.isCompatible());
        assertEquals(0.0, result.overallScore());
    }

    @Test
    void whenInterestsAndHobbiesEmpty_thenScoreComputesSafely() {
        UserPreferences self = createBasePreferences();
        self.setInterests("");
        self.setHobbies("");

        UserPreferences candidate = createBasePreferences();
        candidate.setInterests("");
        candidate.setHobbies("");

        MatchingService.MatchResult result = matchingService.calculateMatch(self, candidate);

        assertTrue(result.isCompatible());
        // Since other features are identical, the score should still evaluate to 100% 
        // without crashing from a divide-by-zero Jaccard calculation.
        assertEquals(100.0, result.overallScore(), 0.1);
    }

    @Test
    void whenPreferencesNull_thenNoCrash() {
        UserPreferences self = new UserPreferences(); // All fields are null
        UserPreferences candidate = createBasePreferences();

        assertDoesNotThrow(() -> {
            MatchingService.MatchResult result = matchingService.calculateMatch(self, candidate);
            // It should be compatible (no deal-breakers) but have a fallback/default score
            assertTrue(result.isCompatible());
            assertTrue(result.overallScore() >= 0.0);
        });
    }

    @Test
    void whenSymmetricDealBreakerViolated_thenIncompatible() {
        // User A (self) does not smoke and has no deal-breakers
        UserPreferences self = createBasePreferences();
        self.setSmoking("yes"); 

        // User B (candidate) does not smoke, but has "no-smoking" deal-breaker
        UserPreferences candidate = createBasePreferences();
        candidate.setSmoking("no");
        candidate.setDealBreakers("no-smoking");

        // Even though A doesn't mind, B's deal-breaker is violated by A
        MatchingService.MatchResult result = matchingService.calculateMatch(self, candidate);

        assertFalse(result.isCompatible());
        assertEquals(0.0, result.overallScore());
    }

    private UserPreferences createBasePreferences() {
        UserPreferences prefs = new UserPreferences();
        prefs.setCleanliness("clean");
        prefs.setNoiseLevel("quiet");
        prefs.setSocialLevel("ambivert");
        prefs.setStudyHabits("moderate");
        prefs.setSleepSchedule("flexible");
        prefs.setSmoking("no");
        prefs.setPets("no");
        prefs.setInterests("gaming,coding,cooking");
        prefs.setHobbies("reading,art");
        
        // Default weights
        prefs.setCleanlinessWeight(3);
        prefs.setNoiseWeight(3);
        prefs.setSocialWeight(3);
        prefs.setStudyWeight(3);
        prefs.setSleepWeight(3);
        prefs.setInterestsWeight(3);
        prefs.setHobbiesWeight(3);
        
        return prefs;
    }
}
