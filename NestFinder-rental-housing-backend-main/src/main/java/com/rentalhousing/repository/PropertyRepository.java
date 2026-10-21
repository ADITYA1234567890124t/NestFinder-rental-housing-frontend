package com.rentalhousing.repository;

import com.rentalhousing.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    Page<Property> findByOwnerId(Long ownerId, Pageable pageable);

    Page<Property> findByAvailableTrueAndActiveTrue(Pageable pageable);

    @Query("""
            SELECT p FROM Property p
            WHERE p.available = true AND p.active = true
            AND (:city IS NULL OR p.city = :city)
            AND (:state IS NULL OR p.state = :state)
            AND (:bhk IS NULL OR p.bhk = :bhk)
            AND (:minRent IS NULL OR p.monthlyRent >= :minRent)
            AND (:maxRent IS NULL OR p.monthlyRent <= :maxRent)
            AND (:propertyType IS NULL OR p.propertyType = :propertyType)
            AND (:furnishingStatus IS NULL OR p.furnishingStatus = :furnishingStatus)
            """)
    Page<Property> searchProperties(
            @Param("city") String city,
            @Param("state") String state,
            @Param("bhk") Integer bhk,
            @Param("minRent") BigDecimal minRent,
            @Param("maxRent") BigDecimal maxRent,
            @Param("propertyType") String propertyType,
            @Param("furnishingStatus") String furnishingStatus,
            Pageable pageable
    );

    @Query("SELECT p FROM Property p WHERE p.available = true AND p.active = true AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Property> fullTextSearch(@Param("query") String query, Pageable pageable);

    Page<Property> findByVerifiedFalseAndActiveTrue(Pageable pageable);

    long countByAvailableTrue();

    List<Property> findTop5ByAvailableTrueAndActiveTrueOrderByCreatedAtDesc();
}
