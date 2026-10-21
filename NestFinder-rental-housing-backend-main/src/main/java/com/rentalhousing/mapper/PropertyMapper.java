package com.rentalhousing.mapper;

import com.rentalhousing.dto.response.PropertyResponseDTO;
import com.rentalhousing.dto.response.UserResponseDTO;
import com.rentalhousing.entity.Property;
import com.rentalhousing.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PropertyMapper {

    private final UserMapper userMapper;
    private final ReviewRepository reviewRepository;

    public PropertyResponseDTO toResponseDTO(Property property) {

        if (property == null) {
            return null;
        }

        // Prevent NullPointerException for images
        List<String> imageUrls = property.getImages() != null
                ? property.getImages()
                  .stream()
                  .map(img -> img.getImageUrl())
                  .toList()
                : Collections.emptyList();

        // Prevent null average rating
        Double avgRating =
                reviewRepository.getAverageRatingByPropertyId(
                        property.getId()
                );

        if (avgRating == null) {
            avgRating = 0.0;
        }

        long reviewCount =
                reviewRepository.countByPropertyId(
                        property.getId()
                );

        // Simple owner object (avoid recursion)
        UserResponseDTO ownerDTO =
                property.getOwner() != null
                        ? userMapper.toResponseDTO(
                        property.getOwner()
                )
                        : null;

        return PropertyResponseDTO.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .monthlyRent(property.getMonthlyRent())
                .bhk(property.getBhk())
                .city(property.getCity())
                .state(property.getState())
                .address(property.getAddress())
                .pincode(property.getPincode())
                .latitude(property.getLatitude())
                .longitude(property.getLongitude())
                .areaSqFt(property.getAreaSqFt())
                .propertyType(property.getPropertyType())
                .furnishingStatus(property.getFurnishingStatus())
                .totalFloors(property.getTotalFloors())
                .floorNumber(property.getFloorNumber())
                .available(property.isAvailable())
                .verified(property.isVerified())
                .depositAmount(property.getDepositAmount())
                .amenities(property.getAmenities())
                .owner(ownerDTO)
                .imageUrls(imageUrls)
                .averageRating(avgRating)
                .reviewCount((int) reviewCount)
                .createdAt(property.getCreatedAt())
                .build();
    }
}