package uz.encode.ecommerce.WebComponents.Banner.entity;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "banner")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Banner {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String image;
    private String title;
    private String description;
    private String buttonText;
    private String buttonLink;

}
