package com.example.Roomie.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users") // This tells JPA to create a table named 'users'
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true) // Email must be unique and not null
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    private String university;
    private String course;
    private String major;
    private String year;
    private String phone;
    private String bio;

    // Relationship with preferences
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private UserPreferences preferences;
    
    // Keep old lifestyle fields for compatibility (deprecated)
    private String sleepSchedule; // e.g., "Early Bird", "Night Owl"
    private String cleanliness;   // e.g., "Neat Freak", "Messy"
    private String smoking;       // e.g., "Yes", "No", "Sometimes"
    private String alcohol;       // e.g., "Yes", "No", "Socially"

    // Add a default constructor (required by JPA)
    public User() {
    }

    // Add a constructor for creating new users
    public User(String email, String password, String name, String university, String course) {
        this.email = email;
        this.password = password; // NOTE: You will need to ENCRYPT this later!
        this.name = name;
        this.university = university;
        this.course = course;
    }

    // Generate GETTERS and SETTERS for all fields.
    // Your IDE (IntelliJ) can do this automatically: Right-click -> Generate -> Getter and Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getSleepSchedule() {
        return sleepSchedule;
    }

    public void setSleepSchedule(String sleepSchedule) {
        this.sleepSchedule = sleepSchedule;
    }

    public String getCleanliness() {
        return cleanliness;
    }

    public void setCleanliness(String cleanliness) {
        this.cleanliness = cleanliness;
    }

    public String getSmoking() {
        return smoking;
    }

    public void setSmoking(String smoking) {
        this.smoking = smoking;
    }

    public String getAlcohol() {
        return alcohol;
    }

    public void setAlcohol(String alcohol) {
        this.alcohol = alcohol;
    }
    
    public String getMajor() {
        return major;
    }
    
    public void setMajor(String major) {
        this.major = major;
    }
    
    public String getYear() {
        return year;
    }
    
    public void setYear(String year) {
        this.year = year;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public UserPreferences getPreferences() {
        return preferences;
    }
    
    public void setPreferences(UserPreferences preferences) {
        this.preferences = preferences;
        if (preferences != null) {
            preferences.setUser(this);
        }
    }
}