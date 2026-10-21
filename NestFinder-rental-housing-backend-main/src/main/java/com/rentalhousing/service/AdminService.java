package com.rentalhousing.service;

import com.rentalhousing.dto.response.UserResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface AdminService {
    Map<String, Object> getDashboardStats();
    Page<UserResponseDTO> getAllUsers(Pageable pageable);
    void banUser(Long userId);
    void unbanUser(Long userId);
    void removeProperty(Long propertyId, String reason);
    void verifyProperty(Long propertyId);
}
