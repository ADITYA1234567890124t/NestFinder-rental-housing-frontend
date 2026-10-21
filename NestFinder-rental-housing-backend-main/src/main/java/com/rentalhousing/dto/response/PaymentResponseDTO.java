package com.rentalhousing.dto.response;

import com.rentalhousing.enums.PaymentMethod;
import com.rentalhousing.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder
public class PaymentResponseDTO {
    private Long id;
    private String transactionId;
    private BigDecimal amount;
    private PaymentStatus status;
    private PaymentMethod paymentMethod;
    private String gatewayTransactionId;
    private String notes;
    private Long bookingId;
    private UserResponseDTO payer;
    private LocalDateTime createdAt;
}
