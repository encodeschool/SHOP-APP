package uz.encode.ecommerce.Product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttributeTranslationDTO {
    private String language;
    private String name; // for attribute name or value translation
}