package com.rentalhousing.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class ReviewResponseDTO {
    private Long id;
    private Integer rating;
    private String comment;
    private UserResponseDTO reviewer;
    private Long propertyId;
    private LocalDateTime createdAt;
}
