package uz.encode.ecommerce.Product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.encode.ecommerce.Product.entity.ProductTranslation;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductTranslationDTO {
    private String language;
    private String name;
    private String description;

    public ProductTranslationDTO(ProductTranslation translation) {
        this.language = translation.getLanguage();
        this.name = translation.getName();
        this.description = translation.getDescription();
    }
}