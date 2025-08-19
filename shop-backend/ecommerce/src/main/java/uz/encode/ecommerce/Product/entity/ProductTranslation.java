package uz.encode.ecommerce.Product.entity;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "product_translations")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ProductTranslation {
    @Id
    @GeneratedValue
    private UUID id;

    private String language;   // "en", "ru", "uz"
    private String name;
    private String description;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}