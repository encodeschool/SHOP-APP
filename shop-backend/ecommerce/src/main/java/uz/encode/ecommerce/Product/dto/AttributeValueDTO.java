package uz.encode.ecommerce.Product.dto;

import java.util.List;
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
    private List<AttributeTranslationDTO> translations; // UPDATED: Added for value translations

    public AttributeValueDTO(UUID attributeId, String value) {
        this.attributeId = attributeId;
        this.value = value;
    }
}