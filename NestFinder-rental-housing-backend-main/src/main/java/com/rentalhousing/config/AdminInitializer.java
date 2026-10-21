package com.rentalhousing.config;

import com.rentalhousing.entity.User;
import com.rentalhousing.enums.Role;
import com.rentalhousing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        String adminEmail = "admin@gmail.com";

        if (!userRepository.existsByEmail(adminEmail)) {

            User admin = User.builder()
                    .fullName("System Admin")
                    .email(adminEmail)
                    .phone("9999999999")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .verified(true)
                    .build();

            userRepository.save(admin);

            System.out.println("Admin created successfully!");
        }
    }
}