package uz.encode.ecommerce.User.controller;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import uz.encode.ecommerce.User.dto.SubscribeRequestDTO;
import uz.encode.ecommerce.User.dto.UserCreateDTO;
import uz.encode.ecommerce.User.dto.UserResponseDTO;
import uz.encode.ecommerce.User.service.UserService;

@RestController
@RequestMapping("/api/users")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
@Tag(name = "User API", description = "Operations related to Users")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Create a new user (supports image upload)")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponseDTO> create(
            @RequestPart("data") String dataJson,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            UserCreateDTO dto = objectMapper.readValue(dataJson, UserCreateDTO.class);
            UserResponseDTO createdUser = userService.create(dto, profilePicture);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON or save image: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Get all users")
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    @Operation(summary = "Get user by ID")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @Operation(summary = "Update user by ID (supports image upload)")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponseDTO> update(
            @PathVariable UUID id,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            UserCreateDTO dto = objectMapper.readValue(dataJson, UserCreateDTO.class);
            UserResponseDTO updatedUser = userService.update(id, dto, profilePicture);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update user: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Delete user by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update-profile")
    public ResponseEntity<UserResponseDTO> updateProfile(
            @RequestPart("data") String dataJson,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            Principal principal) {
        System.out.println("Authenticated user: " + principal.getName()); // ← DEBUG
        return ResponseEntity.ok(userService.updateUserProfile(principal.getName(), dataJson, profilePicture));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<UserResponseDTO> subscribe(@RequestBody SubscribeRequestDTO request) {
        return ResponseEntity.ok(userService.subscribe(request.getEmail()));
    }
}
