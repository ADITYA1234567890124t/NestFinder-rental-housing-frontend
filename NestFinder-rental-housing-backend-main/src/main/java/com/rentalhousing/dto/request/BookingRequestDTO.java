package com.rentalhousing.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequestDTO {

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @Future(message = "Visit date must be in the future")
    private LocalDate visitDate;

    private String visitTimeSlot;

    private LocalDate startDate;
    private LocalDate endDate;
    private String tenantNotes;
}
