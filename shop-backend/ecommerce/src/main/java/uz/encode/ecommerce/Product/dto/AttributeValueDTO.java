package uz.encode.ecommerce.Product.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class AttributeValueDTO {
    private UUID attributeId; // reference to ProductAttribute
    private String value;
}
