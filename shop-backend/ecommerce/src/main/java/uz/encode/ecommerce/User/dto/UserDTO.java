package uz.encode.ecommerce.User.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.encode.ecommerce.User.entity.Role;

import java.util.List;
import java.util.UUID;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {

    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String username;
    private String password;
    private List<Role> role;
    private String profileImageUrl; // Optional

}
