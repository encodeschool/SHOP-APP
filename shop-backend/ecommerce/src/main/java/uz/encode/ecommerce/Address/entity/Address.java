package uz.encode.ecommerce.Address.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uz.encode.ecommerce.User.entity.User;

import java.util.UUID;

@Entity
@Table(name = "addresses")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Address {

    @Id
    @GeneratedValue
    private UUID id;

    private String city;
    private String region;
    private String street;
    private String zipCode;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
