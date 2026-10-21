package com.rentalhousing.websocket;

import com.rentalhousing.dto.request.MessageRequestDTO;
import com.rentalhousing.dto.response.MessageResponseDTO;
import com.rentalhousing.entity.User;
import com.rentalhousing.security.JwtTokenProvider;
import com.rentalhousing.service.MessageService;
import com.rentalhousing.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    /* ------------------------------------------------------------------ */
    /* Send private message                                               */
    /* ------------------------------------------------------------------ */

    @MessageMapping("/chat.send")
    public void sendMessage(
            @Payload MessageRequestDTO request,
            SimpMessageHeaderAccessor headerAccessor
    ) {

        String senderEmail =
                extractEmail(headerAccessor);

        if (senderEmail == null) {

            log.warn(
                    "WebSocket sendMessage: unauthenticated sender"
            );

            return;
        }

        try {

            MessageResponseDTO saved =
                    messageService.sendMessage(
                            request,
                            senderEmail
                    );

            User receiver =
                    userService.getUserEntityById(
                            request.getReceiverId()
                    );

            Map<String, Object> payload =
                    buildMessagePayload(
                            saved,
                            senderEmail
                    );

            /* ---------------------------------------------------- */
            /* Send message to RECEIVER (EMAIL based)              */
            /* ---------------------------------------------------- */

            messagingTemplate.convertAndSendToUser(
                    receiver.getEmail(),
                    "/queue/messages",
                    payload
            );

            /* ---------------------------------------------------- */
            /* Also send message to SENDER so UI updates instantly */
            /* ---------------------------------------------------- */

            messagingTemplate.convertAndSendToUser(
                    senderEmail,
                    "/queue/messages",
                    payload
            );

            /* ---------------------------------------------------- */
            /* Delivery acknowledgement                            */
            /* ---------------------------------------------------- */

            Map<String, Object> ack =
                    new HashMap<>();

            ack.put(
                    "type",
                    "DELIVERY_ACK"
            );

            ack.put(
                    "messageId",
                    saved.getId()
            );

            ack.put(
                    "receiverId",
                    request.getReceiverId()
            );

            ack.put(
                    "timestamp",
                    LocalDateTime.now().toString()
            );

            messagingTemplate.convertAndSendToUser(
                    senderEmail,
                    "/queue/notifications",
                    ack
            );

            log.info(
                    "Message {} sent from {} to {}",
                    saved.getId(),
                    senderEmail,
                    receiver.getEmail()
            );

        } catch (Exception e) {

            log.error(
                    "Failed to send message from {}",
                    senderEmail,
                    e
            );

            sendErrorToUser(
                    senderEmail,
                    "Failed to send message: "
                            + e.getMessage()
            );
        }
    }

    /* ------------------------------------------------------------------ */
    /* Typing indicator                                                   */
    /* ------------------------------------------------------------------ */

    @MessageMapping("/chat.typing")
    public void handleTyping(
            @Payload Map<String, Object> payload,
            SimpMessageHeaderAccessor headerAccessor
    ) {

        String senderEmail =
                extractEmail(headerAccessor);

        if (senderEmail == null) {
            return;
        }

        Object receiverIdObj =
                payload.get("receiverId");

        if (receiverIdObj == null) {
            return;
        }

        try {

            Long receiverId =
                    Long.valueOf(
                            receiverIdObj.toString()
                    );

            User receiver =
                    userService.getUserEntityById(
                            receiverId
                    );

            Map<String, Object> typingPayload =
                    new HashMap<>();

            typingPayload.put(
                    "type",
                    "TYPING"
            );

            typingPayload.put(
                    "senderEmail",
                    senderEmail
            );

            typingPayload.put(
                    "typing",
                    payload.getOrDefault(
                            "typing",
                            true
                    )
            );

            typingPayload.put(
                    "timestamp",
                    LocalDateTime.now().toString()
            );

            messagingTemplate.convertAndSendToUser(
                    receiver.getEmail(),
                    "/queue/messages",
                    typingPayload
            );

        } catch (Exception e) {

            log.error(
                    "Typing indicator failed",
                    e
            );
        }
    }

    /* ------------------------------------------------------------------ */
    /* Read receipts                                                      */
    /* ------------------------------------------------------------------ */

    @MessageMapping("/chat.read")
    public void markRead(
            @Payload Map<String, Object> payload,
            SimpMessageHeaderAccessor headerAccessor
    ) {

        String receiverEmail =
                extractEmail(headerAccessor);

        if (receiverEmail == null) {
            return;
        }

        Object senderIdObj =
                payload.get("senderId");

        if (senderIdObj == null) {
            return;
        }

        try {

            Long senderId =
                    Long.valueOf(
                            senderIdObj.toString()
                    );

            messageService.markAsRead(
                    senderId,
                    receiverEmail
            );

            User sender =
                    userService.getUserEntityById(
                            senderId
                    );

            Map<String, Object> readAck =
                    new HashMap<>();

            readAck.put(
                    "type",
                    "READ_ACK"
            );

            readAck.put(
                    "readerEmail",
                    receiverEmail
            );

            readAck.put(
                    "timestamp",
                    LocalDateTime.now().toString()
            );

            messagingTemplate.convertAndSendToUser(
                    sender.getEmail(),
                    "/queue/notifications",
                    readAck
            );

        } catch (Exception e) {

            log.error(
                    "Failed to mark messages as read",
                    e
            );
        }
    }

    /* ------------------------------------------------------------------ */
    /* Notification helper                                                */
    /* ------------------------------------------------------------------ */

    public void sendNotificationToUser(
            String userEmail,
            String message,
            String type
    ) {

        Map<String, Object> notification =
                new HashMap<>();

        notification.put(
                "type",
                type
        );

        notification.put(
                "message",
                message
        );

        notification.put(
                "timestamp",
                LocalDateTime.now().toString()
        );

        messagingTemplate.convertAndSendToUser(
                userEmail,
                "/queue/notifications",
                notification
        );
    }

    /* ------------------------------------------------------------------ */
    /* Helpers                                                            */
    /* ------------------------------------------------------------------ */

    private String extractEmail(
            SimpMessageHeaderAccessor headerAccessor
    ) {

        Principal principal =
                headerAccessor.getUser();

        if (principal != null) {
            return principal.getName();
        }

        if (
                headerAccessor.getSessionAttributes()
                        != null
        ) {

            Object email =
                    headerAccessor
                            .getSessionAttributes()
                            .get("email");

            if (email != null) {
                return email.toString();
            }
        }

        return null;
    }

    private Map<String, Object> buildMessagePayload(
            MessageResponseDTO message,
            String senderEmail
    ) {

        Map<String, Object> payload =
                new HashMap<>();

        payload.put(
                "type",
                "MESSAGE"
        );

        payload.put(
                "messageId",
                message.getId()
        );

        payload.put(
                "senderId",
                message.getSender() != null
                        ? message.getSender().getId()
                        : null
        );

        payload.put(
                "senderEmail",
                senderEmail
        );

        payload.put(
                "senderName",
                message.getSender() != null
                        ? message.getSender()
                          .getFullName()
                        : "User"
        );

        payload.put(
                "content",
                message.getContent()
        );

        payload.put(
                "timestamp",
                message.getSentAt() != null
                        ? message.getSentAt().toString()
                        : LocalDateTime.now().toString()
        );

        payload.put(
                "isRead",
                message.isRead()
        );

        if (message.getPropertyId() != null) {

            payload.put(
                    "propertyId",
                    message.getPropertyId()
            );
        }

        return payload;
    }

    private void sendErrorToUser(
            String userEmail,
            String errorMessage
    ) {

        Map<String, Object> error =
                new HashMap<>();

        error.put(
                "type",
                "ERROR"
        );

        error.put(
                "message",
                errorMessage
        );

        messagingTemplate.convertAndSendToUser(
                userEmail,
                "/queue/notifications",
                error
        );
    }
}