package com.rentalhousing.mapper;

import com.rentalhousing.dto.response.PaymentResponseDTO;
import com.rentalhousing.entity.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentMapper {

    private final UserMapper userMapper;

    public PaymentResponseDTO toResponseDTO(Payment payment) {
        if (payment == null) return null;
        return PaymentResponseDTO.builder()
                .id(payment.getId())
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .paymentMethod(payment.getPaymentMethod())
                .gatewayTransactionId(payment.getGatewayTransactionId())
                .notes(payment.getNotes())
                .bookingId(payment.getBooking().getId())
                .payer(userMapper.toResponseDTO(payment.getPayer()))
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
