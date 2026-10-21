package com.rentalhousing.mapper;

import com.rentalhousing.dto.response.ComplaintResponseDTO;
import com.rentalhousing.entity.Complaint;
import org.springframework.stereotype.Component;

@Component
public class ComplaintMapper {

    public ComplaintResponseDTO toDTO(
            Complaint complaint
    ) {

        if (complaint == null) {
            return null;
        }

        return ComplaintResponseDTO.builder()
                .id(complaint.getId())
                .subject(complaint.getSubject())
                .description(complaint.getDescription())
                .status(
                        complaint.getStatus() != null
                                ? complaint.getStatus().name()
                                : null
                )
                .resolution(
                        complaint.getResolution()
                )
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
                .createdAt(
                        complaint.getCreatedAt()
                )
                .build();
    }
}