package com.rentalhousing.controller;

import com.rentalhousing.dto.response.UserResponseDTO;
import com.rentalhousing.service.AdminService;
import com.rentalhousing.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin-only operations: dashboard, user management, property verification")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get analytics dashboard statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all registered users (paginated)")
    public ResponseEntity<ApiResponse<Page<UserResponseDTO>>> getAllUsers(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                adminService.getAllUsers(PageRequest.of(page, size))));
    }

    @PatchMapping("/users/{id}/ban")
    @Operation(summary = "Ban a user (disable their account)")
    public ResponseEntity<ApiResponse<Void>> banUser(@PathVariable Long id) {
        adminService.banUser(id);
        return ResponseEntity.ok(ApiResponse.success("User banned"));
    }

    @PatchMapping("/users/{id}/unban")
    @Operation(summary = "Unban a user (re-enable their account)")
    public ResponseEntity<ApiResponse<Void>> unbanUser(@PathVariable Long id) {
        adminService.unbanUser(id);
        return ResponseEntity.ok(ApiResponse.success("User unbanned"));
    }

    @DeleteMapping("/properties/{id}")
    @Operation(summary = "Remove / deactivate a fake or violating property")
    public ResponseEntity<ApiResponse<Void>> removeProperty(
            @PathVariable Long id,
            @RequestParam(defaultValue = "Removed by admin") String reason) {
        adminService.removeProperty(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Property removed"));
    }

    @PatchMapping("/properties/{id}/verify")
    @Operation(summary = "Verify and approve a property listing")
    public ResponseEntity<ApiResponse<Void>> verifyProperty(@PathVariable Long id) {
        adminService.verifyProperty(id);
        return ResponseEntity.ok(ApiResponse.success("Property verified"));
    }
}
