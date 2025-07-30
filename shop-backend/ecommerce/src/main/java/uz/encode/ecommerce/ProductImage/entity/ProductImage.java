package uz.encode.ecommerce.ProductImage.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uz.encode.ecommerce.Product.entity.Product;

import java.util.UUID;

@Entity
@Table(name = "product_images")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductImage {

    @Id
    @GeneratedValue
    private UUID id;

    private String url;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

}