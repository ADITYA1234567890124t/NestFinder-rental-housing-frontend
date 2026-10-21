package com.rentalhousing.controller;

import com.rentalhousing.dto.request.PaymentRequestDTO;
import com.rentalhousing.dto.response.PaymentResponseDTO;
import com.rentalhousing.service.PaymentService;
import com.rentalhousing.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment processing and history")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate")
    @Operation(summary = "Tenant: initiate a rent payment")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> initiatePayment(
            @Valid @RequestBody PaymentRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Payment initiated",
                        paymentService.initiatePayment(request, userDetails.getUsername())));
    }

    @PostMapping("/confirm")
    @Operation(summary = "Confirm a payment after gateway callback")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> confirmPayment(
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success("Payment confirmed",
                paymentService.confirmPayment(
                        body.get("transactionId"),
                        body.get("gatewayTransactionId")
                )));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payment details by ID")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> getPayment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        paymentService.getPaymentById(
                                id,
                                userDetails.getUsername()
                        )
                )
        );
    }

    @GetMapping("/my-payments")
    @Operation(summary = "Get all payments made by the current user")
    public ResponseEntity<ApiResponse<Page<PaymentResponseDTO>>> getMyPayments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        paymentService.getUserPayments(
                                userDetails.getUsername(),
                                PageRequest.of(page, size)
                        )
                )
        );
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get all payments for a specific booking")
    public ResponseEntity<ApiResponse<Page<PaymentResponseDTO>>> getBookingPayments(
            @PathVariable Long bookingId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        paymentService.getBookingPayments(
                                bookingId,
                                PageRequest.of(page, size)
                        )
                )
        );
    }

    @GetMapping("/my-earnings")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @Operation(summary = "Owner: get total rental earnings")
    public ResponseEntity<ApiResponse<BigDecimal>> getEarnings(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        paymentService.getOwnerEarnings(
                                userDetails.getUsername()
                        )
                )
        );
    }

    @GetMapping("/owner-payments")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<Page<PaymentResponseDTO>>> getOwnerPayments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        paymentService.getOwnerPayments(
                                userDetails.getUsername(),
                                PageRequest.of(page, size)
                        )
                )
        );
    }

    @PutMapping("/{paymentId}/approve")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Owner approves a pending payment")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> approvePayment(
            @PathVariable Long paymentId,
            Authentication authentication) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Payment approved successfully",
                        paymentService.approvePayment(
                                paymentId,
                                authentication.getName()
                        )
                )
        );
    }

    @PostMapping("/{id}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: refund a payment")
    public ResponseEntity<ApiResponse<Void>> refundPayment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        paymentService.refundPayment(
                id,
                userDetails.getUsername()
        );

        return ResponseEntity.ok(
                ApiResponse.success("Payment refunded")
        );
    }
}