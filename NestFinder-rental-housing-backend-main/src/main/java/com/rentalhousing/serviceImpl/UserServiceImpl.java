package com.rentalhousing.serviceImpl;

import com.rentalhousing.dto.response.UserResponseDTO;
import com.rentalhousing.entity.User;
import com.rentalhousing.exception.ResourceNotFoundException;
import com.rentalhousing.exception.UnauthorizedException;
import com.rentalhousing.exception.ValidationException;
import com.rentalhousing.mapper.UserMapper;
import com.rentalhousing.repository.UserRepository;
import com.rentalhousing.service.UserService;
import com.rentalhousing.util.Constants;
import com.rentalhousing.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final FileUploadUtil fileUploadUtil;

    @Override
    public UserResponseDTO getUserById(
            Long id
    ) {

        return userMapper.toResponseDTO(
                findById(id)
        );
    }

    @Override
    public UserResponseDTO getCurrentUser(
            String email
    ) {

        return userMapper.toResponseDTO(
                findByEmail(email)
        );
    }

    @Override
    @Transactional
    public UserResponseDTO updateProfile(
            Long id,
            String fullName,
            String phone,
            String city,
            String state,
            String address
    ) {

        User user =
                findById(id);

        if (fullName != null) {
            user.setFullName(fullName);
        }

        if (phone != null) {
            user.setPhone(phone);
        }

        if (city != null) {
            user.setCity(city);
        }

        if (state != null) {
            user.setState(state);
        }

        if (address != null) {
            user.setAddress(address);
        }

        User updatedUser =
                userRepository.save(user);

        return userMapper.toResponseDTO(
                updatedUser
        );
    }

    @Override
    @Transactional
    public UserResponseDTO uploadProfileImage(
            Long id,
            MultipartFile file
    ) {

        User user =
                findById(id);

        try {

            Map<String, Object> result =
                    fileUploadUtil.uploadImage(
                            file,
                            Constants.CLOUDINARY_PROFILE_FOLDER
                    );

            user.setProfileImageUrl(
                    result.get("secure_url")
                            .toString()
            );

            User updatedUser =
                    userRepository.save(user);

            return userMapper.toResponseDTO(
                    updatedUser
            );

        } catch (Exception e) {

            throw new ValidationException(
                    "Failed to upload profile image: "
                            + e.getMessage()
            );
        }
    }

    @Override
    @Transactional
    public void changePassword(
            Long id,
            String currentPassword,
            String newPassword
    ) {

        User user =
                findById(id);

        if (
                !passwordEncoder.matches(
                        currentPassword,
                        user.getPassword()
                )
        ) {

            throw new UnauthorizedException(
                    "Current password is incorrect"
            );
        }

        if (
                newPassword == null
                        || newPassword.length() < 8
        ) {

            throw new ValidationException(
                    "New password must be at least 8 characters"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteAccount(
            Long id
    ) {

        User user =
                findById(id);

        user.setEnabled(false);

        userRepository.save(user);
    }

    @Override
    public Page<UserResponseDTO> getAllUsers(
            Pageable pageable
    ) {

        return userRepository
                .findAll(pageable)
                .map(userMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public void toggleUserStatus(
            Long id
    ) {

        User user =
                findById(id);

        user.setEnabled(
                !user.isEnabled()
        );

        userRepository.save(user);

        log.info(
                "User {} status toggled to {}",
                id,
                user.isEnabled()
        );
    }

    /* --------------------------------------- */
    /* CHAT FIX METHODS                        */
    /* --------------------------------------- */

    @Override
    public User getUserEntityByEmail(
            String email
    ) {

        return findByEmail(email);
    }

    @Override
    public User getUserEntityById(
            Long id
    ) {

        return findById(id);
    }

    /* --------------------------------------- */
    /* PRIVATE HELPERS                         */
    /* --------------------------------------- */

    private User findById(
            Long id
    ) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                Constants.USER_NOT_FOUND
                        ));
    }

    private User findByEmail(
            String email
    ) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                Constants.USER_NOT_FOUND
                        ));
    }
}