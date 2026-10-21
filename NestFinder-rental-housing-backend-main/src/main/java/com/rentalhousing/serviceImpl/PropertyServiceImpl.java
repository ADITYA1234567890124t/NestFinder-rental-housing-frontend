package com.rentalhousing.serviceImpl;

import com.rentalhousing.dto.request.PropertyRequestDTO;import com.rentalhousing.dto.response.PropertyResponseDTO;import com.rentalhousing.entity.Property;import com.rentalhousing.entity.PropertyImage;import com.rentalhousing.entity.User;import com.rentalhousing.exception.ResourceNotFoundException;import com.rentalhousing.exception.UnauthorizedException;import com.rentalhousing.exception.ValidationException;import com.rentalhousing.mapper.PropertyMapper;import com.rentalhousing.repository.PropertyImageRepository;import com.rentalhousing.repository.PropertyRepository;import com.rentalhousing.service.PropertyService;import com.rentalhousing.service.UserService;import com.rentalhousing.util.Constants;import com.rentalhousing.util.FileUploadUtil;import lombok.RequiredArgsConstructor;import lombok.extern.slf4j.Slf4j;import org.springframework.data.domain.Page;import org.springframework.data.domain.Pageable;import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;import java.util.List;import java.util.Map;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final UserService userService;
    private final PropertyMapper propertyMapper;
    private final FileUploadUtil fileUploadUtil;

    @Override
    @Transactional
    public PropertyResponseDTO createProperty(
            PropertyRequestDTO request,
            String ownerEmail
    ) {

        User owner = userService.getUserEntityByEmail(ownerEmail);

        Property property = mapRequestToEntity(
                new Property(),
                request
        );

        property.setOwner(owner);
        property.setVerified(false);
        property.setActive(true);
        property.setAvailable(true);

        if (property.getAreaSqFt() == null) {
            property.setAreaSqFt(0.0);
        }

        Property saved = propertyRepository.save(property);

        log.info(
                "Property created successfully: {}",
                saved.getId()
        );

        return propertyMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public PropertyResponseDTO updateProperty(
            Long id,
            PropertyRequestDTO request,
            String ownerEmail
    ) {

        Property property =
                findAndVerifyOwnership(id, ownerEmail);

        mapRequestToEntity(property, request);

        if (property.getAreaSqFt() == null) {
            property.setAreaSqFt(0.0);
        }

        Property updated =
                propertyRepository.save(property);

        return propertyMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void deleteProperty(
            Long id,
            String ownerEmail
    ) {

        Property property =
                findAndVerifyOwnership(id, ownerEmail);

        property.setActive(false);

        propertyRepository.save(property);
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyResponseDTO getPropertyById(Long id) {

        Property property =
                propertyRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        Constants.PROPERTY_NOT_FOUND
                                ));

        return propertyMapper.toResponseDTO(property);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertyResponseDTO> getAllAvailableProperties(
            Pageable pageable
    ) {

        return propertyRepository
                .findByAvailableTrueAndActiveTrue(pageable)
                .map(propertyMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertyResponseDTO> getPropertiesByOwner(
            Long ownerId,
            Pageable pageable
    ) {

        return propertyRepository
                .findByOwnerId(ownerId, pageable)
                .map(propertyMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public List<String> uploadPropertyImages(
            Long propertyId,
            List<MultipartFile> files,
            String ownerEmail
    ) {

        Property property =
                findAndVerifyOwnership(
                        propertyId,
                        ownerEmail
                );

        long existingCount =
                propertyImageRepository
                        .findByPropertyId(propertyId)
                        .size();

        if (existingCount + files.size()
                > Constants.MAX_IMAGES_PER_PROPERTY) {

            throw new ValidationException(
                    "Cannot exceed "
                            + Constants.MAX_IMAGES_PER_PROPERTY
                            + " images per property"
            );
        }

        List<String> uploadedUrls =
                new ArrayList<>();

        boolean isFirst =
                existingCount == 0;

        for (MultipartFile file : files) {

            try {

                Map<String, Object> result =
                        fileUploadUtil.uploadImage(
                                file,
                                Constants.CLOUDINARY_PROPERTY_FOLDER
                        );

                String url =
                        result.get("secure_url")
                                .toString();

                String publicId =
                        result.get("public_id")
                                .toString();

                PropertyImage image =
                        PropertyImage.builder()
                                .imageUrl(url)
                                .publicId(publicId)
                                .property(property)
                                .isPrimary(isFirst)
                                .build();

                propertyImageRepository.save(image);

                uploadedUrls.add(url);

                isFirst = false;

            } catch (Exception e) {

                log.error(
                        "Upload failed for property {}",
                        propertyId,
                        e
                );

                throw new ValidationException(
                        "Image upload failed"
                );
            }
        }

        return uploadedUrls;
    }

    @Override
    @Transactional
    public void deletePropertyImage(
            Long propertyId,
            Long imageId,
            String ownerEmail
    ) {

        findAndVerifyOwnership(
                propertyId,
                ownerEmail
        );

        PropertyImage image =
                propertyImageRepository.findById(imageId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Image not found"
                                ));

        fileUploadUtil.deleteImage(
                image.getPublicId()
        );

        propertyImageRepository.delete(image);
    }

    @Override
    @Transactional
    public void toggleAvailability(
            Long propertyId,
            String ownerEmail
    ) {

        Property property =
                findAndVerifyOwnership(
                        propertyId,
                        ownerEmail
                );

        property.setAvailable(
                !property.isAvailable()
        );

        propertyRepository.save(property);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertyResponseDTO> searchProperties(
            String city,
            String state,
            Integer bhk,
            BigDecimal minRent,
            BigDecimal maxRent,
            String propertyType,
            String furnishingStatus,
            Pageable pageable
    ) {

        return propertyRepository
                .searchProperties(
                        city,
                        state,
                        bhk,
                        minRent,
                        maxRent,
                        propertyType,
                        furnishingStatus,
                        pageable
                )
                .map(propertyMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public void verifyProperty(
            Long propertyId
    ) {

        Property property =
                propertyRepository.findById(propertyId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        Constants.PROPERTY_NOT_FOUND
                                ));

        property.setVerified(true);

        propertyRepository.save(property);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertyResponseDTO>
    getPendingVerificationProperties(
            Pageable pageable
    ) {

        return propertyRepository
                .findByVerifiedFalseAndActiveTrue(pageable)
                .map(propertyMapper::toResponseDTO);
    }

    private Property findAndVerifyOwnership(
            Long propertyId,
            String ownerEmail
    ) {

        Property property =
                propertyRepository.findById(propertyId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        Constants.PROPERTY_NOT_FOUND
                                ));

        if (property.getOwner() == null
                || !property.getOwner()
                .getEmail()
                .equals(ownerEmail)) {

            throw new UnauthorizedException(
                    Constants.UNAUTHORIZED_ACCESS
            );
        }

        return property;
    }

    private Property mapRequestToEntity(
            Property property,
            PropertyRequestDTO dto
    ) {

        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setMonthlyRent(dto.getMonthlyRent());
        property.setBhk(dto.getBhk());
        property.setCity(dto.getCity());
        property.setState(dto.getState());
        property.setAddress(dto.getAddress());
        property.setPincode(dto.getPincode());
        property.setLatitude(dto.getLatitude());
        property.setLongitude(dto.getLongitude());

        property.setAreaSqFt(
                dto.getAreaSqFt() != null
                        ? dto.getAreaSqFt()
                        : 0.0
        );

        property.setPropertyType(
                dto.getPropertyType()
        );

        property.setFurnishingStatus(
                dto.getFurnishingStatus()
        );

        property.setTotalFloors(
                dto.getTotalFloors()
        );

        property.setFloorNumber(
                dto.getFloorNumber()
        );

        property.setDepositAmount(
                dto.getDepositAmount()
        );

        property.setAmenities(
                dto.getAmenities()
        );

        return property;
    }

}