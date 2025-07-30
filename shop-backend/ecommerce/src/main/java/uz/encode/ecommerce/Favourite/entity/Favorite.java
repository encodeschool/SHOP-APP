package uz.encode.ecommerce.Favourite.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uz.encode.ecommerce.Product.entity.Product;
import uz.encode.ecommerce.User.entity.User;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "favorites")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Favorite {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Product product;

    private LocalDateTime createdAt = LocalDateTime.now();

}
