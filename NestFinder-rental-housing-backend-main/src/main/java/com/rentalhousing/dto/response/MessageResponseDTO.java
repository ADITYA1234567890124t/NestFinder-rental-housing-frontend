package com.rentalhousing.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageResponseDTO {

    private Long id;

    private UserResponseDTO sender;

    private UserResponseDTO receiver;

    private Long propertyId;

    private String content;

    private boolean read;

    private LocalDateTime sentAt;
}