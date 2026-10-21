package com.rentalhousing.controller;

import com.rentalhousing.dto.response.UserResponseDTO;
import com.rentalhousing.service.UserService;
import com.rentalhousing.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                userService.getCurrentUser(userDetails.getUsername())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<UserResponseDTO>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> updates) {
        UserResponseDTO current = userService.getCurrentUser(userDetails.getUsername());
        UserResponseDTO updated = userService.updateProfile(
                current.getId(),
                updates.get("fullName"),
                updates.get("phone"),
                updates.get("city"),
                updates.get("state"),
                updates.get("address")
        );
        return ResponseEntity.ok(ApiResponse.success("Profile updated", updated));
    }

    @PostMapping("/me/profile-image")
    @Operation(summary = "Upload profile picture")
    public ResponseEntity<ApiResponse<UserResponseDTO>> uploadProfileImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        UserResponseDTO current = userService.getCurrentUser(userDetails.getUsername());
        UserResponseDTO updated = userService.uploadProfileImage(current.getId(), file);
        return ResponseEntity.ok(ApiResponse.success("Profile image updated", updated));
    }

    @PutMapping("/me/change-password")
    @Operation(summary = "Change password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        UserResponseDTO current = userService.getCurrentUser(userDetails.getUsername());
        userService.changePassword(current.getId(), body.get("currentPassword"), body.get("newPassword"));
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    @DeleteMapping("/me")
    @Operation(summary = "Deactivate current user account")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserResponseDTO current = userService.getCurrentUser(userDetails.getUsername());
        userService.deleteAccount(current.getId());
        return ResponseEntity.ok(ApiResponse.success("Account deactivated"));
    }
}
