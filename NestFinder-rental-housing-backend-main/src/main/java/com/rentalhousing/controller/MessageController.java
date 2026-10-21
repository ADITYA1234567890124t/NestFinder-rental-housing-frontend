package com.rentalhousing.controller;

import com.rentalhousing.dto.request.MessageRequestDTO;
import com.rentalhousing.dto.response.MessageResponseDTO;
import com.rentalhousing.service.MessageService;
import com.rentalhousing.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Tag(name = "Messages")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<ApiResponse<MessageResponseDTO>> sendMessage(
            @Valid @RequestBody MessageRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        MessageResponseDTO response =
                messageService.sendMessage(
                        request,
                        userDetails.getUsername()
                );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message sent", response));
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<ApiResponse<List<MessageResponseDTO>>> getConversation(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        List<MessageResponseDTO> response =
                messageService.getConversation(
                        userId,
                        userDetails.getUsername()
                );

        return ResponseEntity.ok(
                ApiResponse.success(response)
        );
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getConversations(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        messageService.getConversationList(
                                userDetails.getUsername()
                        )
                )
        );
    }

    @PatchMapping("/read/{senderId}")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long senderId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        messageService.markAsRead(
                senderId,
                userDetails.getUsername()
        );

        return ResponseEntity.ok(
                ApiResponse.success("Messages marked as read")
        );
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        long count =
                messageService.getUnreadCount(
                        userDetails.getUsername()
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        Map.of("unreadCount", count)
                )
        );
    }
}