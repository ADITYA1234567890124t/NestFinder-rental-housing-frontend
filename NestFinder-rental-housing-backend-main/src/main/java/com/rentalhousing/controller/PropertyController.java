package com.rentalhousing.controller;

import com.rentalhousing.dto.request.PropertyRequestDTO;
import com.rentalhousing.dto.response.PropertyResponseDTO;
import com.rentalhousing.service.PropertyService;
import com.rentalhousing.util.ApiResponse;
import com.rentalhousing.util.Constants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@Tag(name = "Properties", description = "Property listing and management")
public class PropertyController {

    private final PropertyService propertyService;

    /* ---------- Public ---------- */

    @GetMapping
    @Operation(summary = "Get all available properties with filters")
    public ResponseEntity<ApiResponse<Page<PropertyResponseDTO>>> getAllProperties(

            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Integer bhk,
            @RequestParam(required = false) BigDecimal minRent,
            @RequestParam(required = false) BigDecimal maxRent,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) String furnishingStatus,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        return ResponseEntity.ok(
                ApiResponse.success(
                        propertyService.searchProperties(
                                city,
                                state,
                                bhk,
                                minRent,
                                maxRent,
                                propertyType,
                                furnishingStatus,
                                PageRequest.of(page, size, sort)
                        )
                )
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get property by ID")
    public ResponseEntity<ApiResponse<PropertyResponseDTO>> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(propertyService.getPropertyById(id)));
    }

    @GetMapping("/owner/{ownerId}")
    @Operation(summary = "Get all properties for a specific owner")
    public ResponseEntity<ApiResponse<Page<PropertyResponseDTO>>> getByOwner(
            @PathVariable Long ownerId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                propertyService.getPropertiesByOwner(ownerId, PageRequest.of(page, size))));
    }

    /* ---------- Owner ---------- */

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @Operation(summary = "Create a new property listing")
    public ResponseEntity<ApiResponse<PropertyResponseDTO>> createProperty(
            @Valid @RequestBody PropertyRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Property created successfully",
                        propertyService.createProperty(request, userDetails.getUsername())));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @Operation(summary = "Update a property listing")
    public ResponseEntity<ApiResponse<PropertyResponseDTO>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Property updated",
                propertyService.updateProperty(id, request, userDetails.getUsername())));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @Operation(summary = "Soft-delete a property listing")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        propertyService.deleteProperty(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Property deleted"));
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @Operation(summary = "Upload property images (max 10 total per property)")
    public ResponseEntity<ApiResponse<List<String>>> uploadImages(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<String> urls = propertyService.uploadPropertyImages(id, files, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Images uploaded", urls));
    }

    @DeleteMapping("/{propertyId}/images/{imageId}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @Operation(summary = "Delete a specific property image")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @PathVariable Long propertyId,
            @PathVariable Long imageId,
            @AuthenticationPrincipal UserDetails userDetails) {
        propertyService.deletePropertyImage(propertyId, imageId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Image deleted"));
    }

    @PatchMapping("/{id}/toggle-availability")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @Operation(summary = "Toggle property availability on/off")
    public ResponseEntity<ApiResponse<Void>> toggleAvailability(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        propertyService.toggleAvailability(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Availability toggled"));
    }

    /* ---------- Admin ---------- */

    @GetMapping("/pending-verification")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get properties pending admin verification")
    public ResponseEntity<ApiResponse<Page<PropertyResponseDTO>>> getPendingVerification(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                propertyService.getPendingVerificationProperties(PageRequest.of(page, size))));
    }

    @PatchMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: verify a property listing")
    public ResponseEntity<ApiResponse<Void>> verifyProperty(@PathVariable Long id) {
        propertyService.verifyProperty(id);
        return ResponseEntity.ok(ApiResponse.success("Property verified"));
    }
}
