package com.rentalhousing.validation;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

import java.lang.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * Central file for all custom validation annotations.
 *
 * Annotations defined here:
 *  1. @ValidPhoneNumber     – Indian mobile number (10-digit, starts with 6–9)
 *  2. @ValidPincode         – Indian 6-digit pincode
 *  3. @StrongPassword       – min 8 chars, uppercase, lowercase, digit, special char
 *  4. @PositiveAmount       – BigDecimal > 0 with configurable max
 *  5. @FutureOrTodayDate    – LocalDate that is today or later
 *  6. @ValidBhk             – 1–10
 *  7. @ValidPropertyType    – whitelisted strings
 *  8. @ValidFurnishingStatus– whitelisted strings
 *  9. @ValidImageContentType– multipart content-type whitelist
 * 10. @NotBlankIfPresent    – if field present (non-null) it must not be blank
 */
public final class CustomValidators {

    private CustomValidators() {}

    /* ================================================================== */
    /*  1. @ValidPhoneNumber                                                */
    /* ================================================================== */

    @Documented
    @Constraint(validatedBy = PhoneNumberValidator.class)
    @Target({ElementType.FIELD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface ValidPhoneNumber {
        String message() default "Invalid Indian phone number. Must be 10 digits starting with 6–9.";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class PhoneNumberValidator
            implements ConstraintValidator<ValidPhoneNumber, String> {

        private static final String PHONE_REGEX = "^[6-9]\\d{9}$";

        @Override
        public boolean isValid(String value, ConstraintValidatorContext ctx) {
            if (value == null || value.isBlank()) return true; // use @NotBlank separately
            return value.matches(PHONE_REGEX);
        }
    }

    /* ================================================================== */
    /*  2. @ValidPincode                                                     */
    /* ================================================================== */

    @Documented
    @Constraint(validatedBy = PincodeValidator.class)
    @Target({ElementType.FIELD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface ValidPincode {
        String message() default "Invalid pincode. Must be a 6-digit Indian postal code.";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class PincodeValidator
            implements ConstraintValidator<ValidPincode, String> {

        @Override
        public boolean isValid(String value, ConstraintValidatorContext ctx) {
            if (value == null || value.isBlank()) return true;
            return value.matches("^[1-9][0-9]{5}$");
        }
    }

    /* ================================================================== */
    /*  3. @StrongPassword                                                  */
    /* ================================================================== */

    @Documented
    @Constraint(validatedBy = StrongPasswordValidator.class)
    @Target({ElementType.FIELD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface StrongPassword {
        String message() default "Password must be at least 8 characters and contain uppercase, lowercase, digit, and special character.";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class StrongPasswordValidator
            implements ConstraintValidator<StrongPassword, String> {

        @Override
        public boolean isValid(String password, ConstraintValidatorContext ctx) {
            if (password == null) return false;

            boolean hasUpper   = password.chars().anyMatch(Character::isUpperCase);
            boolean hasLower   = password.chars().anyMatch(Character::isLowerCase);
            boolean hasDigit   = password.chars().anyMatch(Character::isDigit);
            boolean hasSpecial = password.chars().anyMatch(c ->
                    "!@#$%^&*()_+-=[]{}|;':\",./<>?".indexOf(c) >= 0);
            boolean hasLength  = password.length() >= 8;

            if (hasLength && hasUpper && hasLower && hasDigit && hasSpecial) {
                return true;
            }

            // Build a custom violation message listing what's missing
            ctx.disableDefaultConstraintViolation();
            StringBuilder msg = new StringBuilder("Password must have: ");
            if (!hasLength)  msg.append("at least 8 characters; ");
            if (!hasUpper)   msg.append("an uppercase letter; ");
            if (!hasLower)   msg.append("a lowercase letter; ");
            if (!hasDigit)   msg.append("a digit; ");
            if (!hasSpecial) msg.append("a special character; ");

            ctx.buildConstraintViolationWithTemplate(msg.toString().trim())
               .addConstraintViolation();
            return false;
        }
    }

    /* ================================================================== */
    /*  4. @PositiveAmount                                                  */
    /* ================================================================== */

    @Documented
    @Constraint(validatedBy = PositiveAmountValidator.class)
    @Target({ElementType.FIELD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface PositiveAmount {
        String message() default "Amount must be positive and not exceed the maximum allowed value.";
        double max() default 10_000_000; // 1 crore default max
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class PositiveAmountValidator
            implements ConstraintValidator<PositiveAmount, BigDecimal> {

        private BigDecimal max;

        @Override
        public void initialize(PositiveAmount annotation) {
            this.max = BigDecimal.valueOf(annotation.max());
        }

        @Override
        public boolean isValid(BigDecimal value, ConstraintValidatorContext ctx) {
            if (value == null) return true; // pair with @NotNull
            return value.compareTo(BigDecimal.ZERO) > 0
                && value.compareTo(max) <= 0;
        }
    }

    /* ================================================================== */
    /*  5. @FutureOrTodayDate                                               */
    /* ================================================================== */

    @Documented
    @Constraint(validatedBy = FutureOrTodayDateValidator.class)
    @Target({ElementType.FIELD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface FutureOrTodayDate {
        String message() default "Date must be today or in the future.";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class FutureOrTodayDateValidator
            implements ConstraintValidator<FutureOrTodayDate, LocalDate> {

        @Override
        public boolean isValid(LocalDate value, ConstraintValidatorContext ctx) {
            if (value == null) return true;
            return !value.isBefore(LocalDate.now());
        }
    }

    /* ================================================================== */
    /*  6. @ValidBhk                                                        */
    /* ================================================================== */

    @Documented
    @Constraint(validatedBy = BhkValidator.class)
    @Target({ElementType.FIELD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface ValidBhk {
        String message() default "BHK must be between 1 and 10.";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class BhkValidator
            implements ConstraintValidator<ValidBhk, Integer> {

        @Override
        public boolean isValid(Integer value, ConstraintValidatorContext ctx) {
            if (value == null) return true;
            return value >= 1 && value <= 10;
        }
    }

    /* ================================================================== */
    /*  7. @ValidPropertyType                                               */
    /* ================================================================== */

    @Documented
    @Constraint(validatedBy = PropertyTypeValidator.class)
    @Target({ElementType.FIELD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface ValidPropertyType {
        String message() default "Property type must be one of: Apartment, Villa, PG, Studio, Independent House, Penthouse.";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class PropertyTypeValidator
            implements ConstraintValidator<ValidPropertyType, String> {

        private static final List<String> ALLOWED = Arrays.asList(
                "Apartment", "Villa", "PG", "Studio",
                "Independent House", "Penthouse"
        );

        @Override
        public boolean isValid(String value, ConstraintValidatorContext ctx) {
            if (value == null || value.isBlank()) return true;
            return ALLOWED.contains(value);
        }
    }

    /* ================================================================== */
    /*  8. @ValidFurnishingStatus                                           */
    /* ================================================================== */

    @Documented
    @Constraint(validatedBy = FurnishingStatusValidator.class)
    @Target({ElementType.FIELD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface ValidFurnishingStatus {
        String message() default "Furnishing status must be one of: Furnished, Semi-Furnished, Unfurnished.";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class FurnishingStatusValidator
            implements ConstraintValidator<ValidFurnishingStatus, String> {

        private static final List<String> ALLOWED = Arrays.asList(
                "Furnished", "Semi-Furnished", "Unfurnished"
        );

        @Override
        public boolean isValid(String value, ConstraintValidatorContext ctx) {
            if (value == null || value.isBlank()) return true;
            return ALLOWED.contains(value);
        }
    }

    /* ================================================================== */
    /*  9. @ValidImageContentType                                           */
    /* ================================================================== */

    @Documented
    @Constraint(validatedBy = ImageContentTypeValidator.class)
    @Target({ElementType.FIELD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface ValidImageContentType {
        String message() default "Only JPEG, PNG, and WebP images are allowed.";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class ImageContentTypeValidator
            implements ConstraintValidator<ValidImageContentType, org.springframework.web.multipart.MultipartFile> {

        private static final List<String> ALLOWED_TYPES = Arrays.asList(
                "image/jpeg", "image/png", "image/webp"
        );

        @Override
        public boolean isValid(org.springframework.web.multipart.MultipartFile file,
                               ConstraintValidatorContext ctx) {
            if (file == null || file.isEmpty()) return true;
            return ALLOWED_TYPES.contains(file.getContentType());
        }
    }

    /* ================================================================== */
    /* 10. @NotBlankIfPresent                                               */
    /* ================================================================== */

    @Documented
    @Constraint(validatedBy = NotBlankIfPresentValidator.class)
    @Target({ElementType.FIELD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface NotBlankIfPresent {
        String message() default "Field must not be blank when provided.";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class NotBlankIfPresentValidator
            implements ConstraintValidator<NotBlankIfPresent, String> {

        @Override
        public boolean isValid(String value, ConstraintValidatorContext ctx) {
            // null means "not provided" → valid; empty/blank → invalid
            if (value == null) return true;
            return !value.isBlank();
        }
    }

    /* ================================================================== */
    /* 11. @ValidRating  (1–5 star integer)                                 */
    /* ================================================================== */

    @Documented
    @Constraint(validatedBy = RatingValidator.class)
    @Target({ElementType.FIELD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface ValidRating {
        String message() default "Rating must be an integer between 1 and 5.";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class RatingValidator
            implements ConstraintValidator<ValidRating, Integer> {

        @Override
        public boolean isValid(Integer value, ConstraintValidatorContext ctx) {
            if (value == null) return true;
            return value >= 1 && value <= 5;
        }
    }

    /* ================================================================== */
    /* 12. @DateRangeValid  – endDate must be after startDate               */
    /*     Apply at class level, supply fieldStart / fieldEnd names         */
    /* ================================================================== */

    @Documented
    @Constraint(validatedBy = DateRangeValidator.class)
    @Target({ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface DateRangeValid {
        String message() default "End date must be after start date.";
        String startDateField() default "startDate";
        String endDateField()   default "endDate";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class DateRangeValidator
            implements ConstraintValidator<DateRangeValid, Object> {

        private String startField;
        private String endField;

        @Override
        public void initialize(DateRangeValid annotation) {
            this.startField = annotation.startDateField();
            this.endField   = annotation.endDateField();
        }

        @Override
        public boolean isValid(Object obj, ConstraintValidatorContext ctx) {
            try {
                java.lang.reflect.Field sf = obj.getClass().getDeclaredField(startField);
                java.lang.reflect.Field ef = obj.getClass().getDeclaredField(endField);
                sf.setAccessible(true);
                ef.setAccessible(true);

                LocalDate start = (LocalDate) sf.get(obj);
                LocalDate end   = (LocalDate) ef.get(obj);

                if (start == null || end == null) return true;

                boolean valid = end.isAfter(start);
                if (!valid) {
                    ctx.disableDefaultConstraintViolation();
                    ctx.buildConstraintViolationWithTemplate(ctx.getDefaultConstraintMessageTemplate())
                       .addPropertyNode(endField)
                       .addConstraintViolation();
                }
                return valid;

            } catch (NoSuchFieldException | IllegalAccessException e) {
                return true; // cannot validate, skip
            }
        }
    }
}
