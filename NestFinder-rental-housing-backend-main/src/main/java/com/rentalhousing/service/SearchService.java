package com.rentalhousing.service;

import com.rentalhousing.dto.response.PropertyResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface SearchService {
    Page<PropertyResponseDTO> searchProperties(
            String city,  String state,Integer bhk, BigDecimal minRent, BigDecimal maxRent,
            String propertyType, String furnishingStatus, Pageable pageable);

    Page<PropertyResponseDTO> fullTextSearch(String query, Pageable pageable);
}
