package com.rentalhousing.service;

import com.rentalhousing.dto.request.PropertyRequestDTO;
import com.rentalhousing.dto.response.PropertyResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyService {

    PropertyResponseDTO createProperty(
            PropertyRequestDTO request,
            String ownerEmail
    );

    PropertyResponseDTO updateProperty(
            Long id,
            PropertyRequestDTO request,
            String ownerEmail
    );

    void deleteProperty(
            Long id,
            String ownerEmail
    );

    PropertyResponseDTO getPropertyById(Long id);

    Page<PropertyResponseDTO> getAllAvailableProperties(
            Pageable pageable
    );

    // SEARCH PROPERTIES
    Page<PropertyResponseDTO> searchProperties(
            String city,
            String state,
            Integer bhk,
            BigDecimal minRent,
            BigDecimal maxRent,
            String propertyType,
            String furnishingStatus,
            Pageable pageable
    );

    Page<PropertyResponseDTO> getPropertiesByOwner(
            Long ownerId,
            Pageable pageable
    );

    List<String> uploadPropertyImages(
            Long propertyId,
            List<MultipartFile> files,
            String ownerEmail
    );

    void deletePropertyImage(
            Long propertyId,
            Long imageId,
            String ownerEmail
    );

    void toggleAvailability(
            Long propertyId,
            String ownerEmail
    );

    void verifyProperty(Long propertyId);

    Page<PropertyResponseDTO> getPendingVerificationProperties(
            Pageable pageable
    );
}