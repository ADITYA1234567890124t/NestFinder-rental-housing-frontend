package com.rentalhousing.controller;

import com.rentalhousing.dto.request.ReviewRequestDTO;
import com.rentalhousing.dto.response.ReviewResponseDTO;
import com.rentalhousing.service.ReviewService;
import com.rentalhousing.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Property reviews and ratings")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Add a review for a property")
    public ResponseEntity<ApiResponse<ReviewResponseDTO>> addReview(
            @Valid @RequestBody ReviewRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Review added", reviewService.addReview(request, userDetails.getUsername())));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update your review")
    public ResponseEntity<ApiResponse<ReviewResponseDTO>> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Review updated",
                reviewService.updateReview(id, request, userDetails.getUsername())));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete your review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        reviewService.deleteReview(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Review deleted"));
    }

    @GetMapping("/property/{propertyId}")
    @Operation(summary = "Get all reviews for a property (public)")
    public ResponseEntity<ApiResponse<Page<ReviewResponseDTO>>> getPropertyReviews(
            @PathVariable Long propertyId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                reviewService.getPropertyReviews(propertyId, PageRequest.of(page, size))));
    }

    @GetMapping("/my-reviews")
    @Operation(summary = "Get all reviews written by current user")
    public ResponseEntity<ApiResponse<Page<ReviewResponseDTO>>> getMyReviews(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                reviewService.getUserReviews(userDetails.getUsername(), PageRequest.of(page, size))));
    }
}
