package com.rentalhousing.dto.response;

import com.rentalhousing.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class UserResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String profileImageUrl;
    private Role role;
    private boolean enabled;
    private boolean verified;
    private String city;
    private String state;
    private LocalDateTime createdAt;
}
