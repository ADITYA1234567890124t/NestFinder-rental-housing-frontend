package com.rentalhousing.mapper;

import com.rentalhousing.dto.response.UserResponseDTO;
import com.rentalhousing.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponseDTO toResponseDTO(User user) {
        if (user == null) return null;
        return UserResponseDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .verified(user.isVerified())
                .city(user.getCity())
                .state(user.getState())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
