package uz.encode.ecommerce.User.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.User.config.JwtUtil;
import uz.encode.ecommerce.User.dto.UserCreateDTO;
import uz.encode.ecommerce.User.dto.UserResponseDTO;
import uz.encode.ecommerce.User.service.UserService;

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
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserResponseDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );
        UserResponseDTO user = userService.getByEmail(dto.getEmail());
        String token = jwtUtil.generateJwtToken(dto.getEmail());
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId().toString());
        response.put("roles", user.getRoles());
        return ResponseEntity.ok(response);
    }
}
