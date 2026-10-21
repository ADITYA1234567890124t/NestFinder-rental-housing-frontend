package com.rentalhousing.service;

import com.rentalhousing.dto.response.UserResponseDTO;
import com.rentalhousing.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    UserResponseDTO getUserById(
            Long id
    );

    UserResponseDTO getCurrentUser(
            String email
    );

    UserResponseDTO updateProfile(
            Long id,
            String fullName,
            String phone,
            String city,
            String state,
            String address
    );

    UserResponseDTO uploadProfileImage(
            Long id,
            MultipartFile file
    );

    void changePassword(
            Long id,
            String currentPassword,
            String newPassword
    );

    void deleteAccount(
            Long id
    );

    Page<UserResponseDTO> getAllUsers(
            Pageable pageable
    );

    void toggleUserStatus(
            Long id
    );

    /* --------------------------------------- */
    /* REQUIRED FOR CHAT WEBSOCKET FIX        */
    /* --------------------------------------- */

    User getUserEntityByEmail(
            String email
    );

    User getUserEntityById(
            Long id
    );
}