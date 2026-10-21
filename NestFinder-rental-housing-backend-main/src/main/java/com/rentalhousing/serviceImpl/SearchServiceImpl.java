package com.rentalhousing.serviceImpl;

import com.rentalhousing.dto.response.PropertyResponseDTO;
import com.rentalhousing.mapper.PropertyMapper;
import com.rentalhousing.repository.PropertyRepository;
import com.rentalhousing.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final PropertyRepository propertyRepository;
    private final PropertyMapper propertyMapper;

    @Override
    public Page<PropertyResponseDTO> searchProperties(
            String city,String state, Integer bhk, BigDecimal minRent, BigDecimal maxRent,
            String propertyType, String furnishingStatus, Pageable pageable) {

        return propertyRepository.searchProperties(city, state,bhk, minRent, maxRent,
                propertyType, furnishingStatus, pageable)
                .map(propertyMapper::toResponseDTO);
    }

    @Override
    public Page<PropertyResponseDTO> fullTextSearch(String query, Pageable pageable) {
        return propertyRepository.fullTextSearch(query, pageable)
                .map(propertyMapper::toResponseDTO);
    }
}
