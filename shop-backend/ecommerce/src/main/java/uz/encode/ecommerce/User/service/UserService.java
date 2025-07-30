package uz.encode.ecommerce.User.service;


import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

import uz.encode.ecommerce.User.dto.UserCreateDTO;
import uz.encode.ecommerce.User.dto.UserDTO;
import uz.encode.ecommerce.User.dto.UserResponseDTO;
import uz.encode.ecommerce.User.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserService extends UserDetailsService {

    UserResponseDTO create(UserCreateDTO dto, MultipartFile profilePicture);

    UserResponseDTO create(UserCreateDTO dto);

    List<UserResponseDTO> getAll();

    UserResponseDTO getById(UUID id);

    UserResponseDTO update(UUID id, UserCreateDTO dto, MultipartFile profilePicture);

    void delete(UUID id);

    Optional<UserResponseDTO> findByEmail(String email); // Add this

    UserResponseDTO getByEmail(String email);

    UserResponseDTO updateUserProfile(String email, String dataJson, MultipartFile imageFile);

}
