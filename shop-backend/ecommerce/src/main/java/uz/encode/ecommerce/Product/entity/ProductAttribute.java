package uz.encode.ecommerce.Product.entity;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uz.encode.ecommerce.Category.entity.Category;

@Entity
@Table(name = "product_attribute")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductAttribute {
    @Id 
    @GeneratedValue
    private UUID id;

    private String name; // e.g., "Color", "Size", "Brand"
    
    @Enumerated(EnumType.STRING)
    private AttributeType type;

    private boolean isRequired;

    @ElementCollection
    private List<String> options; // only for type = DROPDOWN
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category; // optional: associate with category
}