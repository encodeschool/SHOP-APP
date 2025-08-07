package uz.encode.ecommerce.Product.entity;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="product_attribute_value")
@Builder
public class ProductAttributeValue {
    @Id 
    @GeneratedValue
    private UUID id;

    private String value; // e.g., "Red", "XL", "Samsung"

    @ManyToOne
    private ProductAttribute attribute;

    @ManyToOne
    private Product product;
}
