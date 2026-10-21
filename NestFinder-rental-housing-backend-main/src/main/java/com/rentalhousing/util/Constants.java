package com.rentalhousing.util;

public final class Constants {

    private Constants() {}

    // Pagination defaults
    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 50;

    // JWT
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";

    // Cloudinary folders
    public static final String CLOUDINARY_PROPERTY_FOLDER = "rental-housing/properties";
    public static final String CLOUDINARY_PROFILE_FOLDER = "rental-housing/profiles";

    // File upload limits
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024L; // 10MB
    public static final String[] ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"};

    // Business rules
    public static final int MAX_IMAGES_PER_PROPERTY = 10;
    public static final int MAX_VISIT_SLOTS_PER_DAY = 5;

    // Roles
    public static final String ROLE_ADMIN   = "ROLE_ADMIN";
    public static final String ROLE_OWNER   = "ROLE_OWNER";
    public static final String ROLE_TENANT  = "ROLE_TENANT";

    // Messages
    public static final String USER_NOT_FOUND        = "User not found";
    public static final String PROPERTY_NOT_FOUND    = "Property not found";
    public static final String BOOKING_NOT_FOUND     = "Booking not found";
    public static final String PAYMENT_NOT_FOUND     = "Payment not found";
    public static final String REVIEW_NOT_FOUND      = "Review not found";
    public static final String COMPLAINT_NOT_FOUND   = "Complaint not found";
    public static final String UNAUTHORIZED_ACCESS   = "You are not authorized to perform this action";
    public static final String DUPLICATE_EMAIL       = "Email already registered";
    public static final String DUPLICATE_REVIEW      = "You have already reviewed this property";
    public static final String DUPLICATE_FAVORITE    = "Property already in favorites";
}
