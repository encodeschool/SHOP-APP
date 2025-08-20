package uz.encode.ecommerce.Category.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.encode.ecommerce.Category.entity.CategoryTranslation;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryTranslationDTO {
    private String language;
    private String name;

    public CategoryTranslationDTO(CategoryTranslation translation) {
        this.language = translation.getLanguage();
        this.name = translation.getName();
    }
}