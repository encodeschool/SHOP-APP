package uz.encode.ecommerce.User.service.impl;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import uz.encode.ecommerce.User.dto.UserCreateDTO;
import uz.encode.ecommerce.User.dto.UserDTO;
import uz.encode.ecommerce.User.dto.UserResponseDTO;
import uz.encode.ecommerce.User.dto.UserUpdateDTO;
import uz.encode.ecommerce.User.entity.Role;
import uz.encode.ecommerce.User.entity.User;
import uz.encode.ecommerce.User.mapper.UserMapper;
import uz.encode.ecommerce.User.repository.UserRepository;
import uz.encode.ecommerce.User.service.UserService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO create(UserCreateDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // encrypt later!
        user.setPhone(dto.getPhone());
        user.setRoles(List.of(Role.BUYER));

        userRepository.save(user);
        return userMapper.mapToDto(user);
    }

    @Override
    public UserResponseDTO create(UserCreateDTO dto, MultipartFile profilePicture) {
        User user = new User();
        user.setName(dto.getName());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());

        if (profilePicture != null && !profilePicture.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + profilePicture.getOriginalFilename();
                Path uploadPath = Paths.get("uploads/");
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(profilePicture.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                user.setProfilePictureUrl("/images/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload profile picture", e);
            }
        }

        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhone(dto.getPhone());
        user.setRoles(dto.getRoles() == null ? List.of(Role.BUYER) : dto.getRoles());

        userRepository.save(user);
        return userMapper.mapToDto(user);
    }

    @Override
    public List<UserResponseDTO> getAll() {
        return userRepository.findAll().stream()
                .map(userMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO getById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.mapToDto(user);
    }

    @Override
    public UserResponseDTO update(UUID id, UserCreateDTO dto, MultipartFile profilePicture) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRoles(dto.getRoles());
        user.setPhone(dto.getPhone());

        if (profilePicture != null && !profilePicture.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + profilePicture.getOriginalFilename();
                Path uploadPath = Paths.get("uploads/");
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(profilePicture.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                user.setProfilePictureUrl("/images/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload profile picture", e);
            }
        }

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return userMapper.mapToDto(user);
    }



    @Override
    public void delete(UUID id) {
        userRepository.deleteById(id);
    }


    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + usernameOrEmail));

        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities);
    }

    @Override
    public Optional<UserResponseDTO> findByEmail(String email) {
        return userRepository.findByEmail(email).map(userMapper::mapToDto);
    }

    @Override
    public UserResponseDTO getByEmail(String email) {
        User user = userRepository.getByEmail(email);
        return userMapper.mapToDto(user);
    }

    @Override
    public UserResponseDTO updateUserProfile(String email, String dataJson, MultipartFile profilePicture) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            UserUpdateDTO dto = mapper.readValue(dataJson, UserUpdateDTO.class);

            User user = userRepository.getByEmail(email);

            user.setName(dto.getName());
            user.setPhone(dto.getPhone());
            user.setUsername(dto.getUsername());

            if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
            }

            if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
                user.setRoles(dto.getRoles());
            }

            if (profilePicture != null && !profilePicture.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + profilePicture.getOriginalFilename();
                Path uploadPath = Paths.get("uploads/");
                Files.createDirectories(uploadPath); // ← This can throw IOException
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(profilePicture.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                user.setProfilePictureUrl("/images/" + fileName);
            }

            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            return userMapper.mapToDto(user);

        } catch (Exception e) {
            // ✅ This will now catch *any* problem, including malformed JSON or file issues
            throw new RuntimeException("Failed to parse JSON or save image: " + e.getMessage(), e);
        }
    }

}
