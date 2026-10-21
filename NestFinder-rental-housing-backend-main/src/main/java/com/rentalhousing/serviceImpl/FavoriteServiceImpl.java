package com.rentalhousing.serviceImpl;

import com.rentalhousing.dto.response.PropertyResponseDTO;
import com.rentalhousing.entity.Favorite;
import com.rentalhousing.entity.Property;
import com.rentalhousing.entity.User;
import com.rentalhousing.exception.DuplicateResourceException;
import com.rentalhousing.exception.ResourceNotFoundException;
import com.rentalhousing.mapper.PropertyMapper;
import com.rentalhousing.repository.FavoriteRepository;
import com.rentalhousing.repository.PropertyRepository;
import com.rentalhousing.service.FavoriteService;
import com.rentalhousing.service.UserService;
import com.rentalhousing.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;
    private final PropertyMapper propertyMapper;

    /**
     * Add property to favorites
     */
    @Override
    @Transactional
    public void addFavorite(Long propertyId, String userEmail) {

        User user = userService.getUserEntityByEmail(userEmail);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                Constants.PROPERTY_NOT_FOUND
                        )
                );

        boolean alreadyExists =
                favoriteRepository.existsByUserIdAndPropertyId(
                        user.getId(),
                        propertyId
                );

        if (alreadyExists) {
            throw new DuplicateResourceException(
                    Constants.DUPLICATE_FAVORITE
            );
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .property(property)
                .build();

        favoriteRepository.save(favorite);

        log.info(
                "Property {} added to favorites by user {}",
                propertyId,
                userEmail
        );
    }

    /**
     * Remove property from favorites
     */
    @Override
    @Transactional
    public void removeFavorite(
            Long propertyId,
            String userEmail
    ) {

        User user = userService.getUserEntityByEmail(userEmail);

        boolean exists =
                favoriteRepository.existsByUserIdAndPropertyId(
                        user.getId(),
                        propertyId
                );

        if (!exists) {
            throw new ResourceNotFoundException(
                    "Favorite property not found"
            );
        }

        favoriteRepository.deleteByUserIdAndPropertyId(
                user.getId(),
                propertyId
        );

        log.info(
                "Property {} removed from favorites by user {}",
                propertyId,
                userEmail
        );
    }

    /**
     * Get all favorites of logged in user
     */
    @Override
    @Transactional(readOnly = true)
    public Page<PropertyResponseDTO> getUserFavorites(
            String userEmail,
            Pageable pageable
    ) {

        User user = userService.getUserEntityByEmail(userEmail);

        Page<Favorite> favorites =
                favoriteRepository.findByUserId(
                        user.getId(),
                        pageable
                );

        return favorites.map(favorite -> {

            Property property = favorite.getProperty();

            if (property == null) {
                throw new ResourceNotFoundException(
                        "Property not found"
                );
            }

            return propertyMapper.toResponseDTO(property);
        });
    }

    /**
     * Check property is favorite or not
     */
    @Override
    @Transactional(readOnly = true)
    public boolean isFavorite(
            Long propertyId,
            String userEmail
    ) {

        User user =
                userService.getUserEntityByEmail(userEmail);

        return favoriteRepository
                .existsByUserIdAndPropertyId(
                        user.getId(),
                        propertyId
                );
    }
}