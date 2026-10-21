package com.rentalhousing.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class PropertyResponseDTO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal monthlyRent;
    private Integer bhk;
    private String city;
    private String state;
    private String address;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private Double areaSqFt;
    private String propertyType;
    private String furnishingStatus;
    private Integer totalFloors;
    private Integer floorNumber;
    private boolean available;
    private boolean verified;
    private Integer depositAmount;
    private String amenities;
    private UserResponseDTO owner;
    private List<String> imageUrls;
    private Double averageRating;
    private Integer reviewCount;
    private LocalDateTime createdAt;
}
