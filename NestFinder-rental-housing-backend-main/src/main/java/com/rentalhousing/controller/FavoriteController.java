package com.rentalhousing.controller;

import com.rentalhousing.dto.response.PropertyResponseDTO;
import com.rentalhousing.service.FavoriteService;
import com.rentalhousing.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Tag(name = "Favorites", description = "Save and manage favorite properties")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{propertyId}")
    @PreAuthorize("hasRole('TENANT')")
    @Operation(summary = "Add a property to favorites")
    public ResponseEntity<ApiResponse<Void>> addFavorite(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Unauthorized"));
        }

        favoriteService.addFavorite(propertyId, userDetails.getUsername());

        return ResponseEntity.ok(
                ApiResponse.success("Added to favorites")
        );
    }

    @DeleteMapping("/{propertyId}")
    @PreAuthorize("hasRole('TENANT')")
    @Operation(summary = "Remove a property from favorites")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Unauthorized"));
        }

        favoriteService.removeFavorite(propertyId, userDetails.getUsername());

        return ResponseEntity.ok(
                ApiResponse.success("Removed from favorites")
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('TENANT')")
    @Operation(summary = "Get all favorite properties for the current user")
    public ResponseEntity<ApiResponse<Page<PropertyResponseDTO>>> getMyFavorites(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        if (userDetails == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Unauthorized"));
        }

        return ResponseEntity.ok(ApiResponse.success(
                favoriteService.getUserFavorites(
                        userDetails.getUsername(),
                        PageRequest.of(page, size)
                )
        ));
    }

    @GetMapping("/{propertyId}/check")
    @PreAuthorize("hasRole('TENANT')")
    @Operation(summary = "Check if property is favorite")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> isFavorite(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Unauthorized"));
        }

        boolean favorite = favoriteService.isFavorite(
                propertyId,
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.success(
                Map.of("isFavorite", favorite)
        ));
    }
}