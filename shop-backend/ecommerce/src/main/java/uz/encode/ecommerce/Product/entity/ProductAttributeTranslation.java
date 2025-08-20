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
@Table(name = "product_attribute_translations")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ProductAttributeTranslation {
    @Id
    @GeneratedValue
    private UUID id;

    private String language; // e.g., "en", "ru", "uz"

    private String name; // Translated name for ProductAttribute or value for ProductAttributeValue

    @ManyToOne
    @JoinColumn(name = "attribute_id")
    private ProductAttribute attribute; // Link to ProductAttribute (for name translations)

    @ManyToOne
    @JoinColumn(name = "attribute_value_id")
    private ProductAttributeValue attributeValue; // Link to ProductAttributeValue (for value translations)
}