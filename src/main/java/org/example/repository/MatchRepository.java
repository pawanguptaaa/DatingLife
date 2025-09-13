package org.example.repository;

import org.example.entity.Match;
import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    
    @Query("SELECT m FROM Match m WHERE (m.user1.id = :userId OR m.user2.id = :userId) AND m.status = 'MATCHED'")
    List<Match> findMatchedByUserId(@Param("userId") Long userId);
    
    @Query("SELECT m FROM Match m WHERE ((m.user1.id = :user1Id AND m.user2.id = :user2Id) OR (m.user1.id = :user2Id AND m.user2.id = :user1Id))")
    Optional<Match> findByUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    
    @Query("SELECT m FROM Match m WHERE m.user2.id = :userId AND m.status = 'PENDING'")
    List<Match> findPendingMatchesForUser(@Param("userId") Long userId);
}