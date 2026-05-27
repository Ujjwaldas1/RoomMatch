package com.example.Roomie.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_preferences")
public class UserPreferences {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
    
    // Lifestyle preferences
    private String cleanliness;
    private String noiseLevel;
    private String socialLevel;
    private String studyHabits;
    private String sleepSchedule;
    private String partying;
    private String pets;
    private String smoking;
    
    // Living preferences
    private String budget;
    private String location;
    private String roomType;
    private String leaseLength;
    
    // Personal interests (stored as comma-separated string for simplicity)
    @Column(length = 1000)
    private String interests;
    
    @Column(length = 1000)
    private String hobbies;
    
    // Additional info
    @Column(length = 2000)
    private String bio;
    
    @Column(length = 1000)
    private String dealBreakers;
    
    // Importance weights (1-5 scale)
    private Integer cleanlinessWeight;
    private Integer noiseWeight;
    private Integer socialWeight;
    private Integer studyWeight;
    private Integer sleepWeight;
    private Integer interestsWeight;
    private Integer hobbiesWeight;
    
    // Default constructor
    public UserPreferences() {}
    
    // Constructor with user
    public UserPreferences(User user) {
        this.user = user;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getCleanliness() {
        return cleanliness;
    }
    
    public void setCleanliness(String cleanliness) {
        this.cleanliness = cleanliness;
    }
    
    public String getNoiseLevel() {
        return noiseLevel;
    }
    
    public void setNoiseLevel(String noiseLevel) {
        this.noiseLevel = noiseLevel;
    }
    
    public String getSocialLevel() {
        return socialLevel;
    }
    
    public void setSocialLevel(String socialLevel) {
        this.socialLevel = socialLevel;
    }
    
    public String getStudyHabits() {
        return studyHabits;
    }
    
    public void setStudyHabits(String studyHabits) {
        this.studyHabits = studyHabits;
    }
    
    public String getSleepSchedule() {
        return sleepSchedule;
    }
    
    public void setSleepSchedule(String sleepSchedule) {
        this.sleepSchedule = sleepSchedule;
    }
    
    public String getPartying() {
        return partying;
    }
    
    public void setPartying(String partying) {
        this.partying = partying;
    }
    
    public String getPets() {
        return pets;
    }
    
    public void setPets(String pets) {
        this.pets = pets;
    }
    
    public String getSmoking() {
        return smoking;
    }
    
    public void setSmoking(String smoking) {
        this.smoking = smoking;
    }
    
    public String getBudget() {
        return budget;
    }
    
    public void setBudget(String budget) {
        this.budget = budget;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getRoomType() {
        return roomType;
    }
    
    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }
    
    public String getLeaseLength() {
        return leaseLength;
    }
    
    public void setLeaseLength(String leaseLength) {
        this.leaseLength = leaseLength;
    }
    
    public String getInterests() {
        return interests;
    }
    
    public void setInterests(String interests) {
        this.interests = interests;
    }
    
    public String getHobbies() {
        return hobbies;
    }
    
    public void setHobbies(String hobbies) {
        this.hobbies = hobbies;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public String getDealBreakers() {
        return dealBreakers;
    }
    
    public void setDealBreakers(String dealBreakers) {
        this.dealBreakers = dealBreakers;
    }

    public Integer getCleanlinessWeight() {
        return cleanlinessWeight;
    }

    public void setCleanlinessWeight(Integer cleanlinessWeight) {
        this.cleanlinessWeight = cleanlinessWeight;
    }

    public Integer getNoiseWeight() {
        return noiseWeight;
    }

    public void setNoiseWeight(Integer noiseWeight) {
        this.noiseWeight = noiseWeight;
    }

    public Integer getSocialWeight() {
        return socialWeight;
    }

    public void setSocialWeight(Integer socialWeight) {
        this.socialWeight = socialWeight;
    }

    public Integer getStudyWeight() {
        return studyWeight;
    }

    public void setStudyWeight(Integer studyWeight) {
        this.studyWeight = studyWeight;
    }

    public Integer getSleepWeight() {
        return sleepWeight;
    }

    public void setSleepWeight(Integer sleepWeight) {
        this.sleepWeight = sleepWeight;
    }

    public Integer getInterestsWeight() {
        return interestsWeight;
    }

    public void setInterestsWeight(Integer interestsWeight) {
        this.interestsWeight = interestsWeight;
    }

    public Integer getHobbiesWeight() {
        return hobbiesWeight;
    }

    public void setHobbiesWeight(Integer hobbiesWeight) {
        this.hobbiesWeight = hobbiesWeight;
    }
}