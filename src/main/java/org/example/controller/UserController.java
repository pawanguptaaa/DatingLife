package org.example.controller;

import org.example.entity.User;
import org.example.repository.UserRepository;
import org.example.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<User> user = userRepository.findById(userPrincipal.getId());
        
        if (user.isPresent()) {
            User currentUser = user.get();
            currentUser.setPassword(null); // Don't send password
            return ResponseEntity.ok(currentUser);
        }
        
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<User> userOpt = userRepository.findById(userPrincipal.getId());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setBio(updatedUser.getBio());
            user.setDepartment(updatedUser.getDepartment());
            user.setJobTitle(updatedUser.getJobTitle());
            user.setProfileImageUrl(updatedUser.getProfileImageUrl());
            user.setInterestedInGenders(updatedUser.getInterestedInGenders());
            
            User savedUser = userRepository.save(user);
            savedUser.setPassword(null);
            return ResponseEntity.ok(savedUser);
        }
        
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/matches")
    public ResponseEntity<List<User>> getPotentialMatches(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<User> userOpt = userRepository.findById(userPrincipal.getId());
        
        if (userOpt.isPresent()) {
            User currentUser = userOpt.get();
            List<User> matches = userRepository.findPotentialMatches(
                currentUser.getId(),
                List.copyOf(currentUser.getInterestedInGenders()),
                currentUser.getDepartment()
            );
            
            // Remove passwords from response
            matches.forEach(match -> match.setPassword(null));
            
            return ResponseEntity.ok(matches);
        }
        
        return ResponseEntity.notFound().build();
    }
}