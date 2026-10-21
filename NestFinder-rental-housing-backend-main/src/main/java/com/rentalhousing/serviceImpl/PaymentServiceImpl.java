package com.rentalhousing.serviceImpl;

import com.rentalhousing.dto.request.PaymentRequestDTO;
import com.rentalhousing.dto.response.PaymentResponseDTO;
import com.rentalhousing.entity.Booking;
import com.rentalhousing.entity.Payment;
import com.rentalhousing.entity.User;
import com.rentalhousing.enums.PaymentStatus;
import com.rentalhousing.exception.ResourceNotFoundException;
import com.rentalhousing.exception.UnauthorizedException;
import com.rentalhousing.exception.ValidationException;
import com.rentalhousing.mapper.PaymentMapper;
import com.rentalhousing.repository.BookingRepository;
import com.rentalhousing.repository.PaymentRepository;
import com.rentalhousing.service.PaymentService;
import com.rentalhousing.service.UserService;
import com.rentalhousing.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final PaymentMapper paymentMapper;

    @Override
    @Transactional
    public PaymentResponseDTO initiatePayment(PaymentRequestDTO request, String payerEmail) {
        User payer = userService.getUserEntityByEmail(payerEmail);
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException(Constants.BOOKING_NOT_FOUND));

        if (!booking.getTenant().getEmail().equals(payerEmail)) {
            throw new UnauthorizedException(Constants.UNAUTHORIZED_ACCESS);
        }

        Payment payment = Payment.builder()
                .transactionId("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .booking(booking)
                .payer(payer)
                .notes(request.getNotes())
                .build();

        Payment saved = paymentRepository.save(payment);
        log.info("Payment {} initiated by {}", saved.getTransactionId(), payerEmail);
        return paymentMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public PaymentResponseDTO confirmPayment(String transactionId, String gatewayTxnId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException(Constants.PAYMENT_NOT_FOUND));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new ValidationException("Payment is already " + payment.getStatus());
        }

        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setGatewayTransactionId(gatewayTxnId);

        log.info("Payment {} confirmed", transactionId);

        return paymentMapper.toResponseDTO(paymentRepository.save(payment));
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDTO getPaymentById(Long paymentId, String userEmail) {

        Payment payment = findById(paymentId);

        String payerEmail = payment.getPayer().getEmail();
        String ownerEmail = payment.getBooking()
                .getProperty()
                .getOwner()
                .getEmail();

        if (!payerEmail.equals(userEmail) &&
                !ownerEmail.equals(userEmail)) {
            throw new UnauthorizedException(Constants.UNAUTHORIZED_ACCESS);
        }

        return paymentMapper.toResponseDTO(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponseDTO> getUserPayments(
            String userEmail,
            Pageable pageable
    ) {

        User user =
                userService.getUserEntityByEmail(userEmail);

        return paymentRepository
                .findByPayerId(user.getId(), pageable)
                .map(paymentMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponseDTO> getBookingPayments(
            Long bookingId,
            Pageable pageable
    ) {
        return paymentRepository
                .findByBookingId(bookingId, pageable)
                .map(paymentMapper::toResponseDTO);
    }

    @Override
    public BigDecimal getOwnerEarnings(String ownerEmail) {

        User owner =
                userService.getUserEntityByEmail(ownerEmail);

        BigDecimal earnings =
                paymentRepository.getTotalEarningsByOwner(owner.getId());

        return earnings != null ? earnings : BigDecimal.ZERO;
    }

    @Override
    @Transactional
    public void refundPayment(Long paymentId, String adminEmail) {

        Payment payment = findById(paymentId);

        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new ValidationException(
                    "Only completed payments can be refunded"
            );
        }

        payment.setStatus(PaymentStatus.REFUNDED);

        paymentRepository.save(payment);

        log.info(
                "Payment {} refunded by admin {}",
                paymentId,
                adminEmail
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponseDTO> getOwnerPayments(
            String ownerEmail,
            Pageable pageable
    ) {

        User owner =
                userService.getUserEntityByEmail(ownerEmail);

        return paymentRepository
                .findByOwnerId(owner.getId(), pageable)
                .map(paymentMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public PaymentResponseDTO approvePayment(
            Long paymentId,
            String ownerEmail
    ) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                Constants.PAYMENT_NOT_FOUND
                        ));

        String actualOwnerEmail = payment.getBooking()
                .getProperty()
                .getOwner()
                .getEmail();

        if (!actualOwnerEmail.equals(ownerEmail)) {
            throw new UnauthorizedException(
                    Constants.UNAUTHORIZED_ACCESS
            );
        }

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new ValidationException(
                    "Only pending payments can be approved"
            );
        }

        payment.setStatus(PaymentStatus.COMPLETED);

        Payment savedPayment = paymentRepository.save(payment);

        log.info(
                "Payment {} approved by owner {}",
                savedPayment.getTransactionId(),
                ownerEmail
        );

        return paymentMapper.toResponseDTO(savedPayment);
    }
    private Payment findById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                Constants.PAYMENT_NOT_FOUND
                        )
                );
    }
}