package com.rentalhousing.service;

import com.rentalhousing.dto.request.LoginRequestDTO;
import com.rentalhousing.dto.request.RegisterRequestDTO;
import com.rentalhousing.dto.response.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO register(RegisterRequestDTO request);
    AuthResponseDTO login(LoginRequestDTO request);
    AuthResponseDTO refreshToken(String refreshToken);
    void logout(String token);
}
