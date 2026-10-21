package com.rentalhousing.dto.response;

import com.rentalhousing.enums.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder
public class BookingResponseDTO {
    private Long id;
    private UserResponseDTO tenant;
    private PropertyResponseDTO property;
    private BookingStatus status;
    private LocalDate visitDate;
    private String visitTimeSlot;
    private LocalDate startDate;
    private LocalDate endDate;
    private String tenantNotes;
    private String ownerNotes;
    private LocalDateTime createdAt;
}
