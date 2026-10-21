package com.rentalhousing.serviceImpl;

import com.rentalhousing.dto.response.UserResponseDTO;
import com.rentalhousing.entity.Property;
import com.rentalhousing.entity.User;
import com.rentalhousing.enums.BookingStatus;
import com.rentalhousing.enums.ComplaintStatus;
import com.rentalhousing.enums.Role;
import com.rentalhousing.exception.ResourceNotFoundException;
import com.rentalhousing.mapper.UserMapper;
import com.rentalhousing.repository.BookingRepository;
import com.rentalhousing.repository.ComplaintRepository;
import com.rentalhousing.repository.PaymentRepository;
import com.rentalhousing.repository.PropertyRepository;
import com.rentalhousing.repository.UserRepository;
import com.rentalhousing.service.AdminService;
import com.rentalhousing.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final ComplaintRepository complaintRepository;
    private final UserMapper userMapper;

    @Override
    public Map<String, Object> getDashboardStats() {

        Map<String, Object> stats = new HashMap<>();

        stats.put(
                "totalUsers",
                userRepository.count()
        );

        stats.put(
                "totalTenants",
                userRepository.countByRole(Role.TENANT)
        );

        stats.put(
                "totalOwners",
                userRepository.countByRole(Role.OWNER)
        );

        stats.put(
                "totalProperties",
                propertyRepository.count()
        );

        stats.put(
                "availableProperties",
                propertyRepository.countByAvailableTrue()
        );

        stats.put(
                "totalBookings",
                bookingRepository.count()
        );

        stats.put(
                "pendingBookings",
                bookingRepository.countByStatus(
                        BookingStatus.PENDING
                )
        );

        stats.put(
                "confirmedBookings",
                bookingRepository.countByStatus(
                        BookingStatus.CONFIRMED
                )
        );

        stats.put(
                "openComplaints",
                complaintRepository.countByStatus(
                        ComplaintStatus.OPEN
                )
        );

        BigDecimal totalRevenue =
                paymentRepository.getTotalRevenue();

        stats.put(
                "totalRevenue",
                totalRevenue != null
                        ? totalRevenue
                        : BigDecimal.ZERO
        );

        // SAFE VERSION (avoids LazyInitializationException)
        stats.put(
                "recentPropertiesCount",
                propertyRepository
                        .findTop5ByAvailableTrueAndActiveTrueOrderByCreatedAtDesc()
                        .size()
        );

        return stats;
    }

    @Override
    public Page<UserResponseDTO> getAllUsers(
            Pageable pageable
    ) {

        return userRepository
                .findAll(pageable)
                .map(userMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public void banUser(Long userId) {

        User user = findUserById(userId);

        user.setEnabled(false);

        userRepository.save(user);

        log.info(
                "User {} banned by admin",
                userId
        );
    }

    @Override
    @Transactional
    public void unbanUser(Long userId) {

        User user = findUserById(userId);

        user.setEnabled(true);

        userRepository.save(user);

        log.info(
                "User {} unbanned by admin",
                userId
        );
    }

    @Override
    @Transactional
    public void removeProperty(
            Long propertyId,
            String reason
    ) {

        Property property =
                propertyRepository.findById(propertyId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        Constants.PROPERTY_NOT_FOUND
                                ));

        property.setActive(false);
        property.setAvailable(false);

        propertyRepository.save(property);

        log.info(
                "Property {} removed by admin. Reason: {}",
                propertyId,
                reason
        );
    }

    @Override
    @Transactional
    public void verifyProperty(Long propertyId) {

        Property property =
                propertyRepository.findById(propertyId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        Constants.PROPERTY_NOT_FOUND
                                ));

        property.setVerified(true);

        propertyRepository.save(property);

        log.info(
                "Property {} verified by admin",
                propertyId
        );
    }

    private User findUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                Constants.USER_NOT_FOUND
                        ));
    }
}