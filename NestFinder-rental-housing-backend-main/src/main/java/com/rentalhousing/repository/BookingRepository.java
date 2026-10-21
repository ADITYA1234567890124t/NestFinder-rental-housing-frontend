package com.rentalhousing.repository;

import com.rentalhousing.entity.Booking;
import com.rentalhousing.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByTenantId(Long tenantId, Pageable pageable);

    Page<Booking> findByPropertyOwnerId(Long ownerId, Pageable pageable);

    Page<Booking> findByPropertyId(Long propertyId, Pageable pageable);

    List<Booking> findByTenantIdAndStatus(Long tenantId, BookingStatus status);

    boolean existsByTenantIdAndPropertyId(Long tenantId, Long propertyId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    long countByStatus(BookingStatus status);
}