package org.example.controller;

import org.example.entity.Match;
import org.example.entity.Message;
import org.example.entity.User;
import org.example.repository.MatchRepository;
import org.example.repository.MessageRepository;
import org.example.repository.UserRepository;
import org.example.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MatchRepository matchRepository;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody SendMessageRequest request, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long senderId = userPrincipal.getId();

        // Verify users exist
        Optional<User> senderOpt = userRepository.findById(senderId);
        Optional<User> recipientOpt = userRepository.findById(request.getRecipientId());

        if (senderOpt.isEmpty() || recipientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Verify users are matched
        Optional<Match> match = matchRepository.findByUsers(senderId, request.getRecipientId());
        if (match.isEmpty() || match.get().getStatus() != Match.MatchStatus.MATCHED) {
            return ResponseEntity.badRequest().body("You can only message matched users");
        }

        Message message = new Message();
        message.setSender(senderOpt.get());
        message.setRecipient(recipientOpt.get());
        message.setContent(request.getContent());

        Message savedMessage = messageRepository.save(message);
        
        // Remove passwords before sending response
        savedMessage.getSender().setPassword(null);
        savedMessage.getRecipient().setPassword(null);
        
        return ResponseEntity.ok(savedMessage);
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<Message>> getConversation(@PathVariable Long userId, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long currentUserId = userPrincipal.getId();

        // Verify users are matched
        Optional<Match> match = matchRepository.findByUsers(currentUserId, userId);
        if (match.isEmpty() || match.get().getStatus() != Match.MatchStatus.MATCHED) {
            return ResponseEntity.badRequest().build();
        }

        List<Message> messages = messageRepository.findMessagesBetweenUsers(currentUserId, userId);
        
        // Remove passwords and mark messages as read
        messages.forEach(message -> {
            message.getSender().setPassword(null);
            message.getRecipient().setPassword(null);
            
            // Mark as read if recipient is current user
            if (message.getRecipient().getId().equals(currentUserId) && message.getReadAt() == null) {
                message.setReadAt(LocalDateTime.now());
                messageRepository.save(message);
            }
        });

        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Message>> getUnreadMessages(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Message> unreadMessages = messageRepository.findUnreadMessages(userPrincipal.getId());
        
        // Remove passwords
        unreadMessages.forEach(message -> {
            message.getSender().setPassword(null);
            message.getRecipient().setPassword(null);
        });
        
        return ResponseEntity.ok(unreadMessages);
    }

    public static class SendMessageRequest {
        private Long recipientId;
        private String content;

        public Long getRecipientId() {
            return recipientId;
        }

        public void setRecipientId(Long recipientId) {
            this.recipientId = recipientId;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}