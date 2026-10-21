package com.rentalhousing.serviceImpl;

import com.rentalhousing.dto.request.BookingRequestDTO;
import com.rentalhousing.dto.response.BookingResponseDTO;
import com.rentalhousing.entity.Booking;
import com.rentalhousing.entity.Property;
import com.rentalhousing.entity.User;
import com.rentalhousing.enums.BookingStatus;
import com.rentalhousing.exception.ResourceNotFoundException;
import com.rentalhousing.exception.UnauthorizedException;
import com.rentalhousing.exception.ValidationException;
import com.rentalhousing.mapper.BookingMapper;
import com.rentalhousing.repository.BookingRepository;
import com.rentalhousing.repository.PropertyRepository;
import com.rentalhousing.service.BookingService;
import com.rentalhousing.service.UserService;
import com.rentalhousing.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;
    private final BookingMapper bookingMapper;

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request, String tenantEmail) {
        User tenant = userService.getUserEntityByEmail(tenantEmail);
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException(Constants.PROPERTY_NOT_FOUND));

        if (!property.isAvailable()) {
            throw new ValidationException("Property is not available for booking");
        }
        if (property.getOwner().getEmail().equals(tenantEmail)) {
            throw new ValidationException("Owner cannot book their own property");
        }

        Booking booking = Booking.builder()
                .tenant(tenant)
                .property(property)
                .status(BookingStatus.PENDING)
                .visitDate(request.getVisitDate())
                .visitTimeSlot(request.getVisitTimeSlot())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .tenantNotes(request.getTenantNotes())
                .build();

        Booking saved = bookingRepository.save(booking);
        log.info("Booking {} created by tenant {} for property {}", saved.getId(), tenantEmail, property.getId());
        return bookingMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long bookingId, String userEmail) {
        Booking booking = findById(bookingId);
        String tenantEmail = booking.getTenant().getEmail();
        String ownerEmail  = booking.getProperty().getOwner().getEmail();
        if (!tenantEmail.equals(userEmail) && !ownerEmail.equals(userEmail)) {
            throw new UnauthorizedException(Constants.UNAUTHORIZED_ACCESS);
        }
        return bookingMapper.toResponseDTO(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getTenantBookings(String tenantEmail, Pageable pageable) {
        User tenant = userService.getUserEntityByEmail(tenantEmail);
        return bookingRepository.findByTenantId(tenant.getId(), pageable)
                .map(bookingMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getOwnerBookings(String ownerEmail, Pageable pageable) {
        User owner = userService.getUserEntityByEmail(ownerEmail);
        return bookingRepository.findByPropertyOwnerId(owner.getId(), pageable)
                .map(bookingMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getPropertyBookings(Long propertyId, String ownerEmail, Pageable pageable) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException(Constants.PROPERTY_NOT_FOUND));
        if (!property.getOwner().getEmail().equals(ownerEmail)) {
            throw new UnauthorizedException(Constants.UNAUTHORIZED_ACCESS);
        }
        return bookingRepository.findByPropertyId(propertyId, pageable)
                .map(bookingMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getAllBookings(Pageable pageable) {
        return bookingRepository
                .findAll(pageable)
                .map(bookingMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public BookingResponseDTO updateBookingStatus(Long bookingId, BookingStatus status,
                                                  String userEmail, String ownerNotes) {
        Booking booking = findById(bookingId);
        String ownerEmail = booking.getProperty().getOwner().getEmail();

        if (!ownerEmail.equals(userEmail)) {
            throw new UnauthorizedException(Constants.UNAUTHORIZED_ACCESS);
        }
        booking.setStatus(status);
        if (ownerNotes != null) booking.setOwnerNotes(ownerNotes);
        return bookingMapper.toResponseDTO(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId, String userEmail) {
        Booking booking = findById(bookingId);
        boolean isTenant = booking.getTenant().getEmail().equals(userEmail);
        boolean isOwner  = booking.getProperty().getOwner().getEmail().equals(userEmail);
        if (!isTenant && !isOwner) {
            throw new UnauthorizedException(Constants.UNAUTHORIZED_ACCESS);
        }
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new ValidationException("Cannot cancel a completed booking");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private Booking findById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(Constants.BOOKING_NOT_FOUND));
    }
}