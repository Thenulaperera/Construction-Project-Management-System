package com.worksitex.service;

import com.worksitex.model.Message;
import com.worksitex.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    // Create a new message
    public Message createMessage(Message message) {
        if (message.getContent() == null || message.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }
        if (message.getSenderName() == null || message.getSenderName().trim().isEmpty()) {
            throw new IllegalArgumentException("Sender name cannot be empty");
        }

        message.setCreatedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        message.setIsRead(false);

        return messageRepository.save(message);
    }

    // Get all messages
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    // Get message by ID
    public Optional<Message> getMessageById(Long id) {
        return messageRepository.findById(id);
    }

    // Update a message
    public Message updateMessage(Long id, Message updatedMessage) {
        Optional<Message> existingMessage = messageRepository.findById(id);

        if (existingMessage.isPresent()) {
            Message message = existingMessage.get();

            if (updatedMessage.getContent() != null && !updatedMessage.getContent().trim().isEmpty()) {
                message.setContent(updatedMessage.getContent());
            }

            if (updatedMessage.getRecipientName() != null) {
                message.setRecipientName(updatedMessage.getRecipientName());
            }

            if (updatedMessage.getMessageType() != null) {
                message.setMessageType(updatedMessage.getMessageType());
            }

            message.setUpdatedAt(LocalDateTime.now());
            return messageRepository.save(message);
        } else {
            throw new RuntimeException("Message not found with id: " + id);
        }
    }

    // Delete a message
    public void deleteMessage(Long id) {
        if (!messageRepository.existsById(id)) {
            throw new RuntimeException("Message not found with id: " + id);
        }
        messageRepository.deleteById(id);
    }

    // Get messages by sender
    public List<Message> getMessagesBySender(String senderName) {
        return messageRepository.findBySenderNameOrderByCreatedAtDesc(senderName);
    }

    // Get messages by recipient
    public List<Message> getMessagesByRecipient(String recipientName) {
        return messageRepository.findByRecipientNameOrderByCreatedAtDesc(recipientName);
    }

    // Get direct messages between two users
    public List<Message> getDirectMessages(String user1, String user2) {
        return messageRepository.findDirectMessagesBetween(user1, user2);
    }

    // Get messages by type
    public List<Message> getMessagesByType(Message.MessageType messageType) {
        return messageRepository.findByMessageTypeOrderByCreatedAtDesc(messageType);
    }

    // Get unread messages for a user
    public List<Message> getUnreadMessages(String recipientName) {
        return messageRepository.findByRecipientNameAndIsReadFalseOrderByCreatedAtDesc(recipientName);
    }

    // Mark message as read
    public Message markAsRead(Long id) {
        Optional<Message> message = messageRepository.findById(id);
        if (message.isPresent()) {
            Message msg = message.get();
            msg.setIsRead(true);
            msg.setUpdatedAt(LocalDateTime.now());
            return messageRepository.save(msg);
        } else {
            throw new RuntimeException("Message not found with id: " + id);
        }
    }

    // Search messages by content
    public List<Message> searchMessages(String searchText) {
        return messageRepository.findByContentContaining(searchText);
    }

    // Get unread message count for a user
    public long getUnreadCount(String recipientName) {
        return messageRepository.countByRecipientNameAndIsReadFalse(recipientName);
    }

    // Get general chat messages
    public List<Message> getGeneralMessages() {
        return messageRepository.findGeneralMessages();
    }
}
