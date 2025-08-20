package uz.encode.ecommerce.Product.dto;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductAttributeDTO {
    private UUID id;
    private String name;
    private String type;
    private boolean isRequired;
    private UUID categoryId;
    private List<String> options;
    private List<AttributeTranslationDTO> translations;
}