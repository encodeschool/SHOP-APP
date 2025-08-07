package uz.encode.ecommerce.Product.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttributeValueDTO {
    private UUID attributeId; // reference to ProductAttribute
    private String value;
}
