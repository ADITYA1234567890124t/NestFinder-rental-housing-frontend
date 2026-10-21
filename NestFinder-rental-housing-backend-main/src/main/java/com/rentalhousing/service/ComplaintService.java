package com.rentalhousing.service;

import com.rentalhousing.dto.request.ComplaintRequestDTO;
import com.rentalhousing.dto.response.ComplaintResponseDTO;
import com.rentalhousing.enums.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ComplaintService {

    ComplaintResponseDTO createComplaint(
            ComplaintRequestDTO request,
            String userEmail
    );

    ComplaintResponseDTO updateComplaintStatus(
            Long complaintId,
            ComplaintStatus status,
            String resolution,
            String adminEmail
    );

    Page<ComplaintResponseDTO> getUserComplaints(
            String userEmail,
            Pageable pageable
    );

    Page<ComplaintResponseDTO> getAllComplaints(
            Pageable pageable
    );

    Page<ComplaintResponseDTO> getComplaintsByStatus(
            ComplaintStatus status,
            Pageable pageable
    );

    ComplaintResponseDTO getComplaintById(Long id);
}