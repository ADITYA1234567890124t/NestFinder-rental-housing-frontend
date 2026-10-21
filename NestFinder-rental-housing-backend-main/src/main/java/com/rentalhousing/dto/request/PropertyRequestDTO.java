package com.rentalhousing.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PropertyRequestDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    private String description;

    @NotNull(message = "Monthly rent is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Rent must be positive")
    private BigDecimal monthlyRent;

    @NotNull(message = "BHK is required")
    @Min(value = 1)
    @Max(value = 10)
    private Integer bhk;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Address is required")
    private String address;

    private String pincode;
    private Double latitude;
    private Double longitude;

    @Min(value = 0)
    private Double areaSqFt;

    private String propertyType;
    private String furnishingStatus;
    private Integer totalFloors;
    private Integer floorNumber;
    private Integer depositAmount;
    private String amenities;
}
