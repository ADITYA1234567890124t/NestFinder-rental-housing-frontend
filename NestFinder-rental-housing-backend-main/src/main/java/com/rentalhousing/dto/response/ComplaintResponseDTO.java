package com.rentalhousing.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ComplaintResponseDTO {

    private Long id;

    private String subject;

    private String description;

    private String status;

    private String resolution;

    private Long propertyId;

    private Long complainantId;

    private LocalDateTime createdAt;
}