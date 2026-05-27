package com.example.Roomie.repository;

import com.example.Roomie.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // This simple line gives you free CRUD methods:
    // .save(user), .findAll(), .findById(id), .deleteById(id)

    // Let's add a custom method you will NEED for login
    User findByEmail(String email);

    // Find user by name
    Optional<User> findByName(String name);

    // Exclude current user when searching roommates
    List<User> findByIdNot(Long id);
}
