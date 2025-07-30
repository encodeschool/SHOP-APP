package uz.encode.ecommerce.User.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class UserResponseDTO {
    private UUID id;
    private String name;
    private String email;
    private String username;
    private String password;
    private String phone;
    private List<String> roles;
    private LocalDateTime createdAt;
    private String profilePictureUrl;
}
