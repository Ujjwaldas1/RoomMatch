package com.example.Roomie.repository;

import com.example.Roomie.entity.UserPreferences;
import com.example.Roomie.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreferences, Long> {
    Optional<UserPreferences> findByUser(User user);
    Optional<UserPreferences> findByUserId(Long userId);
}