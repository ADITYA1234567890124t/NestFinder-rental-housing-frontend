package com.rentalhousing.serviceImpl;

import com.rentalhousing.dto.request.ReviewRequestDTO;
import com.rentalhousing.dto.response.ReviewResponseDTO;
import com.rentalhousing.entity.Property;
import com.rentalhousing.entity.Review;
import com.rentalhousing.entity.User;
import com.rentalhousing.exception.DuplicateResourceException;
import com.rentalhousing.exception.ResourceNotFoundException;
import com.rentalhousing.exception.UnauthorizedException;
import com.rentalhousing.mapper.UserMapper;
import com.rentalhousing.repository.PropertyRepository;
import com.rentalhousing.repository.ReviewRepository;
import com.rentalhousing.service.ReviewService;
import com.rentalhousing.service.UserService;
import com.rentalhousing.util.Constants;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public ReviewResponseDTO addReview(ReviewRequestDTO request, String reviewerEmail) {

        User reviewer = userService.getUserEntityByEmail(reviewerEmail);

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                Constants.PROPERTY_NOT_FOUND
                        ));

        if (reviewRepository.existsByReviewerIdAndPropertyId(
                reviewer.getId(),
                property.getId()
        )) {
            throw new DuplicateResourceException(
                    Constants.DUPLICATE_REVIEW
            );
        }

        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .reviewer(reviewer)
                .property(property)
                .build();

        Review savedReview = reviewRepository.save(review);

        return toDTO(savedReview);
    }

    @Override
    @Transactional
    public ReviewResponseDTO updateReview(Long reviewId,
                                          ReviewRequestDTO request,
                                          String reviewerEmail) {

        Review review = findById(reviewId);

        if (!review.getReviewer().getEmail()
                .equals(reviewerEmail)) {

            throw new UnauthorizedException(
                    Constants.UNAUTHORIZED_ACCESS
            );
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return toDTO(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, String userEmail) {

        Review review = findById(reviewId);

        if (!review.getReviewer().getEmail()
                .equals(userEmail)) {

            throw new UnauthorizedException(
                    Constants.UNAUTHORIZED_ACCESS
            );
        }

        reviewRepository.delete(review);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponseDTO> getPropertyReviews(
            Long propertyId,
            Pageable pageable
    ) {

        return reviewRepository
                .findByPropertyId(propertyId, pageable)
                .map(this::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponseDTO> getUserReviews(
            String userEmail,
            Pageable pageable
    ) {

        userService.getUserEntityByEmail(userEmail);

        return reviewRepository.findAll(pageable)
                .map(this::toDTO);
    }

    private Review findById(Long id) {

        return reviewRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                Constants.REVIEW_NOT_FOUND
                        ));
    }

    private ReviewResponseDTO toDTO(Review review) {

        Long propertyId = null;

        if (review.getProperty() != null) {
            propertyId = review.getProperty().getId();
        }

        return ReviewResponseDTO.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewer(
                        userMapper.toResponseDTO(
                                review.getReviewer()
                        )
                )
                .propertyId(propertyId)
                .createdAt(review.getCreatedAt())
                .build();
    }
}