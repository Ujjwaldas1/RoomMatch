package com.example.Roomie.dto;

import com.example.Roomie.entity.User;
import com.example.Roomie.entity.UserPreferences;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO for User responses — never expose the raw entity (which contains password hash).
 */
public class UserDto {

    private Long id;
    private String name;
    private String email;
    private String university;
    private String course;
    private String major;
    private String year;
    private String phone;
    private String bio;
    private UserPreferences preferences;

    public UserDto() {}

    /**
     * Build a UserDto from the User entity, optionally attaching preferences.
     */
    public static UserDto fromEntity(User user, UserPreferences prefs) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setUniversity(user.getUniversity());
        dto.setCourse(user.getCourse());
        dto.setMajor(user.getMajor());
        dto.setYear(user.getYear());
        dto.setPhone(user.getPhone());
        dto.setBio(user.getBio());

        if (prefs != null) {
            dto.setPreferences(prefs);
        }

        return dto;
    }

    public static UserDto fromEntity(User user) {
        return fromEntity(user, null);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public UserPreferences getPreferences() { return preferences; }
    public void setPreferences(UserPreferences preferences) { this.preferences = preferences; }
}
