package com.rentalhousing.service;

import com.rentalhousing.dto.request.MessageRequestDTO;
import com.rentalhousing.dto.response.MessageResponseDTO;

import java.util.List;
import java.util.Map;

public interface MessageService {

    MessageResponseDTO sendMessage(
            MessageRequestDTO request,
            String senderEmail
    );

    List<MessageResponseDTO> getConversation(
            Long otherUserId,
            String currentUserEmail
    );

    List<Map<String, Object>> getConversationList(
            String userEmail
    );

    void markAsRead(
            Long senderId,
            String receiverEmail
    );

    long getUnreadCount(String userEmail);
}