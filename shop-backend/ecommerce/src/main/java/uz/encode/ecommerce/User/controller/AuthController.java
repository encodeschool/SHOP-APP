package uz.encode.ecommerce.User.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import uz.encode.ecommerce.User.config.JwtUtil;
import uz.encode.ecommerce.User.dto.UserCreateDTO;
import uz.encode.ecommerce.User.dto.UserResponseDTO;
import uz.encode.ecommerce.User.entity.User;
import uz.encode.ecommerce.User.repository.UserRepository;
import uz.encode.ecommerce.User.service.UserService;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody UserCreateDTO userDto) {
        if (userService.findByEmail(userDto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Email is already taken"));
        }

        UserResponseDTO user = userService.create(userDto); // Use UserService to create user
        String token = jwtUtil.generateJwtToken(user.getEmail());
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId().toString());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserResponseDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );
        UserResponseDTO user = userService.getByEmail(dto.getEmail());
        String token = jwtUtil.generateJwtToken(dto.getEmail());
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId().toString());
        return ResponseEntity.ok(response);
    }
}
