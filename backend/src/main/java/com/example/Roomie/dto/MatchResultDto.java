package com.example.Roomie.dto;

import java.util.List;

public class MatchResultDto {
    private Long userId;
    private String name;
    private int compatibilityScore;
    private List<String> sharedInterests;

    public MatchResultDto() {}

    public MatchResultDto(Long userId, String name, int compatibilityScore, List<String> sharedInterests) {
        this.userId = userId;
        this.name = name;
        this.compatibilityScore = compatibilityScore;
        this.sharedInterests = sharedInterests;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCompatibilityScore() {
        return compatibilityScore;
    }

    public void setCompatibilityScore(int compatibilityScore) {
        this.compatibilityScore = compatibilityScore;
    }

    public List<String> getSharedInterests() {
        return sharedInterests;
    }

    public void setSharedInterests(List<String> sharedInterests) {
        this.sharedInterests = sharedInterests;
    }
}
