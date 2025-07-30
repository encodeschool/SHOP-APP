package uz.encode.ecommerce.User.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uz.encode.ecommerce.Address.entity.Address;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue
    private UUID id;


    private String name;
    @Column(unique = true)
    private String email;

    private String username;
    private String password;
    private String phone;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<Role> roles = new ArrayList<>(); // e.g. ["BUYER", "SELLER"]

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Address> addresses;

    private String profilePictureUrl;

}
