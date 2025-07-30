package uz.encode.ecommerce.User.mapper;

import org.springframework.stereotype.Component;
import uz.encode.ecommerce.User.dto.UserDTO;
import uz.encode.ecommerce.User.dto.UserResponseDTO;
import uz.encode.ecommerce.User.entity.Role;
import uz.encode.ecommerce.User.entity.User;

import java.util.Collection;
import java.util.Collections;

@Component
public class UserMapper {

    public UserResponseDTO mapToDto(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setPassword(user.getPassword());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        dto.setRoles(user.getRoles().stream().map(Enum::name).toList());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        return dto;
    }

}
