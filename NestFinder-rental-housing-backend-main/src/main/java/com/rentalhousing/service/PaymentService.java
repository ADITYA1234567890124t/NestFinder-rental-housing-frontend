package com.rentalhousing.service;

import com.rentalhousing.dto.request.PaymentRequestDTO;
import com.rentalhousing.dto.response.PaymentResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

public interface PaymentService {

    PaymentResponseDTO initiatePayment(
            PaymentRequestDTO request,
            String payerEmail
    );

    PaymentResponseDTO confirmPayment(
            String transactionId,
            String gatewayTxnId
    );

    PaymentResponseDTO getPaymentById(
            Long paymentId,
            String userEmail
    );

    Page<PaymentResponseDTO> getUserPayments(
            String userEmail,
            Pageable pageable
    );

    Page<PaymentResponseDTO> getBookingPayments(
            Long bookingId,
            Pageable pageable
    );

    BigDecimal getOwnerEarnings(
            String ownerEmail
    );

    void refundPayment(
            Long paymentId,
            String adminEmail
    );

    Page<PaymentResponseDTO> getOwnerPayments(
            String ownerEmail,
            Pageable pageable
    );

    @Transactional
    PaymentResponseDTO approvePayment(
            Long paymentId,
            String ownerEmail
    );
}