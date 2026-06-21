package com.worksitex.controller;

import com.worksitex.model.Message;
import com.worksitex.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // Create a new message
    @PostMapping
    public ResponseEntity<?> createMessage(@RequestBody Message message) {
        try {
            Message createdMessage = messageService.createMessage(message);
            return new ResponseEntity<>(createdMessage, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating message: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all messages
    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        try {
            List<Message> messages = messageService.getAllMessages();
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get message by ID
    @GetMapping("/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable Long id) {
        try {
            Optional<Message> message = messageService.getMessageById(id);
            if (message.isPresent()) {
                return new ResponseEntity<>(message.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update a message
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMessage(@PathVariable Long id, @RequestBody Message message) {
        try {
            Message updatedMessage = messageService.updateMessage(id, message);
            return new ResponseEntity<>(updatedMessage, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating message: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a message
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMessage(@PathVariable Long id) {
        try {
            messageService.deleteMessage(id);
            return new ResponseEntity<>("Message deleted successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting message: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get messages by sender
    @GetMapping("/sender/{senderName}")
    public ResponseEntity<List<Message>> getMessagesBySender(@PathVariable String senderName) {
        try {
            List<Message> messages = messageService.getMessagesBySender(senderName);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get messages by recipient
    @GetMapping("/recipient/{recipientName}")
    public ResponseEntity<List<Message>> getMessagesByRecipient(@PathVariable String recipientName) {
        try {
            List<Message> messages = messageService.getMessagesByRecipient(recipientName);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get direct messages between two users
    @GetMapping("/direct/{user1}/{user2}")
    public ResponseEntity<List<Message>> getDirectMessages(@PathVariable String user1, @PathVariable String user2) {
        try {
            List<Message> messages = messageService.getDirectMessages(user1, user2);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get messages by type
    @GetMapping("/type/{messageType}")
    public ResponseEntity<List<Message>> getMessagesByType(@PathVariable Message.MessageType messageType) {
        try {
            List<Message> messages = messageService.getMessagesByType(messageType);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get unread messages for a user
    @GetMapping("/unread/{recipientName}")
    public ResponseEntity<List<Message>> getUnreadMessages(@PathVariable String recipientName) {
        try {
            List<Message> messages = messageService.getUnreadMessages(recipientName);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Mark message as read
    @PutMapping("/{id}/read")
    public ResponseEntity<Message> markAsRead(@PathVariable Long id) {
        try {
            Message message = messageService.markAsRead(id);
            return new ResponseEntity<>(message, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Search messages by content
    @GetMapping("/search")
    public ResponseEntity<List<Message>> searchMessages(@RequestParam String query) {
        try {
            List<Message> messages = messageService.searchMessages(query);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get unread message count for a user
    @GetMapping("/count/unread/{recipientName}")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String recipientName) {
        try {
            long count = messageService.getUnreadCount(recipientName);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get general chat messages
    @GetMapping("/general")
    public ResponseEntity<List<Message>> getGeneralMessages() {
        try {
            List<Message> messages = messageService.getGeneralMessages();
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
