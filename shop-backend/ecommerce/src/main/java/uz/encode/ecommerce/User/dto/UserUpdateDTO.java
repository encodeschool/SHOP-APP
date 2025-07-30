package uz.encode.ecommerce.User.dto;

import lombok.Data;
import uz.encode.ecommerce.User.entity.Role;

import java.util.List;

@Data
public class UserUpdateDTO {
    private String name;
    private String phone;
    private String username;
    private String email;
    private String password;
    private List<Role> roles;
}

