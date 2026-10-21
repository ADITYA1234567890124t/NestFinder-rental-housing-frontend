package com.rentalhousing.controller;

import com.rentalhousing.dto.request.BookingRequestDTO;
import com.rentalhousing.dto.response.BookingResponseDTO;
import com.rentalhousing.enums.BookingStatus;
import com.rentalhousing.service.BookingService;
import com.rentalhousing.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(
        name = "Bookings",
        description = "Property visit booking and rental management"
)
public class BookingController {

    private final BookingService bookingService;

    // ==========================
    // CREATE BOOKING (TENANT)
    // ==========================
    @PostMapping
    @Operation(summary = "Create a new booking / visit request")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> createBooking(
            @Valid @RequestBody BookingRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        BookingResponseDTO booking =
                bookingService.createBooking(
                        request,
                        userDetails.getUsername()
                );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Booking created successfully",
                                booking
                        )
                );
    }

    // ==========================
    // GET BOOKING BY ID
    // ==========================
    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> getBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        bookingService.getBookingById(
                                id,
                                userDetails.getUsername()
                        )
                )
        );
    }

    // ==========================
    // GET ALL BOOKINGS (ADMIN)
    // ==========================
    @GetMapping
    @Operation(summary = "Admin: Get all bookings")
    public ResponseEntity<ApiResponse<Page<BookingResponseDTO>>> getAllBookings(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        bookingService.getAllBookings(
                                PageRequest.of(page, size)
                        )
                )
        );
    }

    // ==========================
    // TENANT BOOKINGS
    // ==========================
    @GetMapping("/my-bookings")
    @Operation(summary = "Tenant: Get my bookings")
    public ResponseEntity<ApiResponse<Page<BookingResponseDTO>>> getMyBookings(

            @AuthenticationPrincipal UserDetails userDetails,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        bookingService.getTenantBookings(
                                userDetails.getUsername(),
                                PageRequest.of(page, size)
                        )
                )
        );
    }

    // ==========================
    // OWNER RECEIVED BOOKINGS
    // ==========================
    @GetMapping("/received")
    @Operation(summary = "Owner: Get received bookings")
    public ResponseEntity<ApiResponse<Page<BookingResponseDTO>>> getReceivedBookings(

            @AuthenticationPrincipal UserDetails userDetails,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        bookingService.getOwnerBookings(
                                userDetails.getUsername(),
                                PageRequest.of(page, size)
                        )
                )
        );
    }

    // ==========================
    // PROPERTY BOOKINGS
    // ==========================
    @GetMapping("/property/{propertyId}")
    @Operation(summary = "Owner: Get bookings for a property")
    public ResponseEntity<ApiResponse<Page<BookingResponseDTO>>> getPropertyBookings(

            @PathVariable Long propertyId,

            @AuthenticationPrincipal UserDetails userDetails,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        bookingService.getPropertyBookings(
                                propertyId,
                                userDetails.getUsername(),
                                PageRequest.of(page, size)
                        )
                )
        );
    }

    // ==========================
    // UPDATE BOOKING STATUS
    // ==========================
    @PatchMapping("/{id}/status")
    @Operation(summary = "Owner: Approve / Reject booking")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> updateStatus(

            @PathVariable Long id,

            @RequestBody Map<String, String> body,

            @AuthenticationPrincipal UserDetails userDetails
    ) {

        BookingStatus status =
                BookingStatus.valueOf(
                        body.get("status").toUpperCase()
                );

        String ownerNotes =
                body.get("ownerNotes");

        BookingResponseDTO updatedBooking =
                bookingService.updateBookingStatus(
                        id,
                        status,
                        userDetails.getUsername(),
                        ownerNotes
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Booking status updated",
                        updatedBooking
                )
        );
    }

    // ==========================
    // CANCEL BOOKING
    // ==========================
    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel booking")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(

            @PathVariable Long id,

            @AuthenticationPrincipal UserDetails userDetails
    ) {

        bookingService.cancelBooking(
                id,
                userDetails.getUsername()
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Booking cancelled"
                )
        );
    }
}