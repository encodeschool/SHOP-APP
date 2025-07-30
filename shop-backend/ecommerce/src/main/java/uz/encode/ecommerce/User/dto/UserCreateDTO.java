package uz.encode.ecommerce.User.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import uz.encode.ecommerce.User.entity.Role;

import java.util.List;
import java.util.UUID;

@Data
public class UserCreateDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Email must be valid")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String phone;

    private List<Role> roles;

    private String profilePictureUrl;
}
