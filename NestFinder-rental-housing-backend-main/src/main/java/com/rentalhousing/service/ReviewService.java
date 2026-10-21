package com.rentalhousing.service;

import com.rentalhousing.dto.request.ReviewRequestDTO;
import com.rentalhousing.dto.response.ReviewResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewResponseDTO addReview(ReviewRequestDTO request, String reviewerEmail);
    ReviewResponseDTO updateReview(Long reviewId, ReviewRequestDTO request, String reviewerEmail);
    void deleteReview(Long reviewId, String userEmail);
    Page<ReviewResponseDTO> getPropertyReviews(Long propertyId, Pageable pageable);
    Page<ReviewResponseDTO> getUserReviews(String userEmail, Pageable pageable);
}
