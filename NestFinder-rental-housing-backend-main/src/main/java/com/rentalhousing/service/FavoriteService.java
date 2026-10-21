package com.rentalhousing.service;

import com.rentalhousing.dto.response.PropertyResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FavoriteService {
    void addFavorite(Long propertyId, String userEmail);
    void removeFavorite(Long propertyId, String userEmail);
    Page<PropertyResponseDTO> getUserFavorites(String userEmail, Pageable pageable);
    boolean isFavorite(Long propertyId, String userEmail);
}
