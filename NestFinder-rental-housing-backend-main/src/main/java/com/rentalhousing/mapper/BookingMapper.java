package com.rentalhousing.mapper;

import com.rentalhousing.dto.response.BookingResponseDTO;
import com.rentalhousing.dto.response.PropertyResponseDTO;
import com.rentalhousing.entity.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingMapper {

    private final UserMapper userMapper;

    public BookingResponseDTO toResponseDTO(Booking booking) {

        if (booking == null) {
            return null;
        }

        // Simple property response (avoid recursion)
        PropertyResponseDTO propertyDTO =
                PropertyResponseDTO.builder()
                        .id(booking.getProperty().getId())
                        .title(booking.getProperty().getTitle())
                        .city(booking.getProperty().getCity())
                        .state(booking.getProperty().getState())
                        .address(booking.getProperty().getAddress())
                        .monthlyRent(booking.getProperty().getMonthlyRent())
                        .bhk(booking.getProperty().getBhk())
                        .available(booking.getProperty().isAvailable())
                        .verified(booking.getProperty().isVerified())
                        .build();

        return BookingResponseDTO.builder()
                .id(booking.getId())
                .tenant(
                        userMapper.toResponseDTO(
                                booking.getTenant()
                        )
                )
                .property(propertyDTO)
                .status(booking.getStatus())
                .visitDate(booking.getVisitDate())
                .visitTimeSlot(booking.getVisitTimeSlot())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .tenantNotes(booking.getTenantNotes())
                .ownerNotes(booking.getOwnerNotes())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}