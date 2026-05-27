package com.example.Roomie.service;

import com.example.Roomie.entity.User;
import com.example.Roomie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getRoommates(String email) {
        User currentUser = userRepository.findByEmail(email);
        if (currentUser == null) {
            throw new RuntimeException("Current user not found");
        }
        return userRepository.findByIdNot(currentUser.getId());
    }
}

