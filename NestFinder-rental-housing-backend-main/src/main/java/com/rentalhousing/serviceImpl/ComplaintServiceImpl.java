package com.rentalhousing.serviceImpl;

import com.rentalhousing.dto.request.ComplaintRequestDTO;
import com.rentalhousing.dto.response.ComplaintResponseDTO;
import com.rentalhousing.entity.Complaint;
import com.rentalhousing.entity.Property;
import com.rentalhousing.entity.User;
import com.rentalhousing.enums.ComplaintStatus;
import com.rentalhousing.exception.ResourceNotFoundException;
import com.rentalhousing.repository.ComplaintRepository;
import com.rentalhousing.repository.PropertyRepository;
import com.rentalhousing.service.ComplaintService;
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
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;

    @Override
    @Transactional
    public ComplaintResponseDTO createComplaint(
            ComplaintRequestDTO request,
            String userEmail
    ) {

        User complainant =
                userService.getUserEntityByEmail(userEmail);

        Property property = null;

        if (request.getPropertyId() != null) {
            property = propertyRepository
                    .findById(request.getPropertyId())
                    .orElse(null);
        }

        Complaint complaint = Complaint.builder()
                .subject(request.getSubject())
                .description(request.getDescription())
                .status(ComplaintStatus.OPEN)
                .complainant(complainant)
                .property(property)
                .build();

        Complaint savedComplaint =
                complaintRepository.save(complaint);

        log.info("Complaint created by {}", userEmail);

        return mapToDTO(savedComplaint);
    }

    @Override
    @Transactional
    public ComplaintResponseDTO updateComplaintStatus(
            Long complaintId,
            ComplaintStatus status,
            String resolution,
            String adminEmail
    ) {

        Complaint complaint =
                findById(complaintId);

        User admin =
                userService.getUserEntityByEmail(adminEmail);

        complaint.setStatus(status);
        complaint.setResolution(resolution);
        complaint.setResolvedBy(admin);

        Complaint updatedComplaint =
                complaintRepository.save(complaint);

        log.info(
                "Complaint {} updated to {} by admin {}",
                complaintId,
                status,
                adminEmail
        );

        return mapToDTO(updatedComplaint);
    }

    @Override
    public Page<ComplaintResponseDTO> getUserComplaints(
            String userEmail,
            Pageable pageable
    ) {

        User user =
                userService.getUserEntityByEmail(userEmail);

        return complaintRepository
                .findByComplainantId(
                        user.getId(),
                        pageable
                )
                .map(this::mapToDTO);
    }

    @Override
    public Page<ComplaintResponseDTO> getAllComplaints(
            Pageable pageable
    ) {

        return complaintRepository
                .findAll(pageable)
                .map(this::mapToDTO);
    }

    @Override
    public Page<ComplaintResponseDTO> getComplaintsByStatus(
            ComplaintStatus status,
            Pageable pageable
    ) {

        return complaintRepository
                .findByStatus(status, pageable)
                .map(this::mapToDTO);
    }

    @Override
    public ComplaintResponseDTO getComplaintById(
            Long id
    ) {

        return mapToDTO(findById(id));
    }

    private Complaint findById(Long id) {

        return complaintRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                Constants.COMPLAINT_NOT_FOUND
                        ));
    }

    private ComplaintResponseDTO mapToDTO(
            Complaint complaint
    ) {

        return ComplaintResponseDTO.builder()
                .id(complaint.getId())
                .subject(complaint.getSubject())
                .description(complaint.getDescription())
                .status(complaint.getStatus().name())
                .resolution(complaint.getResolution())
                .propertyId(
                        complaint.getProperty() != null
                                ? complaint.getProperty().getId()
                                : null
                )
                .complainantId(
                        complaint.getComplainant() != null
                                ? complaint.getComplainant().getId()
                                : null
                )
                .createdAt(complaint.getCreatedAt())
                .build();
    }
}