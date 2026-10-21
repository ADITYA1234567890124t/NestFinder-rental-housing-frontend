package com.rentalhousing.repository;

import com.rentalhousing.entity.Payment;
import com.rentalhousing.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query(
            value = """
                    SELECT p
                    FROM Payment p
                    JOIN FETCH p.payer
                    WHERE p.payer.id = :payerId
                    """,
            countQuery = """
                    SELECT COUNT(p)
                    FROM Payment p
                    WHERE p.payer.id = :payerId
                    """
    )
    Page<Payment> findByPayerId(
            @Param("payerId") Long payerId,
            Pageable pageable
    );

    @Query(
            value = """
                    SELECT p
                    FROM Payment p
                    JOIN FETCH p.payer
                    WHERE p.booking.id = :bookingId
                    """,
            countQuery = """
                    SELECT COUNT(p)
                    FROM Payment p
                    WHERE p.booking.id = :bookingId
                    """
    )
    Page<Payment> findByBookingId(
            @Param("bookingId") Long bookingId,
            Pageable pageable
    );

    Optional<Payment> findByTransactionId(String transactionId);

    @Query("""
            SELECT SUM(p.amount)
            FROM Payment p
            WHERE p.status = 'COMPLETED'
            AND p.booking.property.owner.id = :ownerId
            """)
    BigDecimal getTotalEarningsByOwner(Long ownerId);

    @Query("""
            SELECT SUM(p.amount)
            FROM Payment p
            WHERE p.status = 'COMPLETED'
            """)
    BigDecimal getTotalRevenue();

    @Query(
            value = """
                    SELECT p
                    FROM Payment p
                    JOIN FETCH p.payer
                    JOIN FETCH p.booking b
                    JOIN FETCH b.property property
                    WHERE property.owner.id = :ownerId
                    """,
            countQuery = """
                    SELECT COUNT(p)
                    FROM Payment p
                    WHERE p.booking.property.owner.id = :ownerId
                    """
    )
    Page<Payment> findByOwnerId(
            @Param("ownerId") Long ownerId,
            Pageable pageable
    );

    Page<Payment> findByStatus(
            PaymentStatus status,
            Pageable pageable
    );
}