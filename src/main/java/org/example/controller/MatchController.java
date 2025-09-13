package org.example.controller;

import org.example.entity.Match;
import org.example.entity.User;
import org.example.repository.MatchRepository;
import org.example.repository.UserRepository;
import org.example.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MatchController {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/like/{targetUserId}")
    public ResponseEntity<?> likeUser(@PathVariable Long targetUserId, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long currentUserId = userPrincipal.getId();

        if (currentUserId.equals(targetUserId)) {
            return ResponseEntity.badRequest().body("Cannot like yourself");
        }

        Optional<User> currentUserOpt = userRepository.findById(currentUserId);
        Optional<User> targetUserOpt = userRepository.findById(targetUserId);

        if (currentUserOpt.isEmpty() || targetUserOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Check if match already exists
        Optional<Match> existingMatch = matchRepository.findByUsers(currentUserId, targetUserId);
        if (existingMatch.isPresent()) {
            Match match = existingMatch.get();
            if (match.getUser2().getId().equals(currentUserId) && match.getStatus() == Match.MatchStatus.PENDING) {
                // This is a mutual like - create a match!
                match.setStatus(Match.MatchStatus.MATCHED);
                matchRepository.save(match);
                return ResponseEntity.ok(new MatchResponse("It's a match!", true));
            }
            return ResponseEntity.badRequest().body("Already liked this user");
        }

        // Create new like
        Match newMatch = new Match();
        newMatch.setUser1(currentUserOpt.get());
        newMatch.setUser2(targetUserOpt.get());
        newMatch.setStatus(Match.MatchStatus.PENDING);
        matchRepository.save(newMatch);

        return ResponseEntity.ok(new MatchResponse("Like sent successfully", false));
    }

    @PostMapping("/reject/{targetUserId}")
    public ResponseEntity<?> rejectUser(@PathVariable Long targetUserId, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long currentUserId = userPrincipal.getId();

        Optional<Match> existingMatch = matchRepository.findByUsers(currentUserId, targetUserId);
        if (existingMatch.isPresent() && existingMatch.get().getUser2().getId().equals(currentUserId)) {
            Match match = existingMatch.get();
            match.setStatus(Match.MatchStatus.REJECTED);
            matchRepository.save(match);
        }

        return ResponseEntity.ok(new MatchResponse("User rejected", false));
    }

    @GetMapping("/my-matches")
    public ResponseEntity<List<Match>> getMyMatches(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Match> matches = matchRepository.findMatchedByUserId(userPrincipal.getId());
        
        // Remove passwords from users in matches
        matches.forEach(match -> {
            match.getUser1().setPassword(null);
            match.getUser2().setPassword(null);
        });
        
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Match>> getPendingMatches(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Match> pendingMatches = matchRepository.findPendingMatchesForUser(userPrincipal.getId());
        
        // Remove passwords from users
        pendingMatches.forEach(match -> {
            match.getUser1().setPassword(null);
            match.getUser2().setPassword(null);
        });
        
        return ResponseEntity.ok(pendingMatches);
    }

    public static class MatchResponse {
        private String message;
        private boolean isMatch;

        public MatchResponse(String message, boolean isMatch) {
            this.message = message;
            this.isMatch = isMatch;
        }

        public String getMessage() {
            return message;
        }

        public boolean isMatch() {
            return isMatch;
        }
    }
}