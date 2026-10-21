package com.rentalhousing.service;

import com.rentalhousing.dto.request.BookingRequestDTO;
import com.rentalhousing.dto.response.BookingResponseDTO;
import com.rentalhousing.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {

    BookingResponseDTO createBooking(
            BookingRequestDTO request,
            String tenantEmail
    );

    BookingResponseDTO updateBookingStatus(
            Long bookingId,
            BookingStatus status,
            String userEmail,
            String ownerNotes
    );

    BookingResponseDTO getBookingById(
            Long bookingId,
            String userEmail
    );

    Page<BookingResponseDTO> getTenantBookings(
            String tenantEmail,
            Pageable pageable
    );

    Page<BookingResponseDTO> getOwnerBookings(
            String ownerEmail,
            Pageable pageable
    );

    Page<BookingResponseDTO> getPropertyBookings(
            Long propertyId,
            String ownerEmail,
            Pageable pageable
    );

    Page<BookingResponseDTO> getAllBookings(
            Pageable pageable
    );

    void cancelBooking(
            Long bookingId,
            String userEmail
    );
}