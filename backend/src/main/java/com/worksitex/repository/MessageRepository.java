package com.worksitex.repository;

import com.worksitex.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Find messages by sender name
    List<Message> findBySenderNameOrderByCreatedAtDesc(String senderName);

    // Find messages by recipient name
    List<Message> findByRecipientNameOrderByCreatedAtDesc(String recipientName);

    // Find direct messages between two users
    @Query("SELECT m FROM Message m WHERE " +
            "(m.senderName = :user1 AND m.recipientName = :user2) OR " +
            "(m.senderName = :user2 AND m.recipientName = :user1) " +
            "ORDER BY m.createdAt ASC")
    List<Message> findDirectMessagesBetween(@Param("user1") String user1, @Param("user2") String user2);

    // Find messages by type
    List<Message> findByMessageTypeOrderByCreatedAtDesc(Message.MessageType messageType);

    // Find unread messages for a user
    List<Message> findByRecipientNameAndIsReadFalseOrderByCreatedAtDesc(String recipientName);

    // Find messages containing specific text
    @Query("SELECT m FROM Message m WHERE m.content LIKE %:searchText% ORDER BY m.createdAt DESC")
    List<Message> findByContentContaining(@Param("searchText") String searchText);

    // Count unread messages for a user
    long countByRecipientNameAndIsReadFalse(String recipientName);

    // Find latest messages (for general chat)
    @Query("SELECT m FROM Message m WHERE m.messageType = 'GENERAL' ORDER BY m.createdAt DESC")
    List<Message> findGeneralMessages();
}
