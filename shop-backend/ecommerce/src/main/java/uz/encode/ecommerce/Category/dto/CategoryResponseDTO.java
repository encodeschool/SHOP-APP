package uz.encode.ecommerce.Category.dto;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.encode.ecommerce.Category.entity.Category;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponseDTO {
    private UUID id;
    private String name;
    private UUID parentId;
    private String icon;
    private String categoryCode;
    private List<CategoryResponseDTO> subcategories;
    private List<CategoryTranslationDTO> translations;
    private String lang;

    public CategoryResponseDTO(Category category, String language) {
        this.id = category.getId();
        
        // Find translation for the requested language or fall back to default name
        CategoryTranslationDTO translation = category.getTranslations() != null
            ? category.getTranslations().stream()
                .filter(t -> t.getLanguage().equalsIgnoreCase(language))
                .map(CategoryTranslationDTO::new)
                .findFirst()
                .orElse(null)
            : null;
        
        this.name = translation != null ? translation.getName() : category.getName();
        this.categoryCode = category.getCategoryCode();
        this.icon = category.getIcon();
        this.parentId = category.getParent() != null ? category.getParent().getId() : null;
        this.subcategories = category.getSubcategories() != null
            ? category.getSubcategories().stream()
                .map(sub -> new CategoryResponseDTO(sub, language))
                .collect(Collectors.toList())
            : null;
        this.translations = category.getTranslations() != null
            ? category.getTranslations().stream()
                .map(CategoryTranslationDTO::new)
                .collect(Collectors.toList())
            : null;
        this.lang = language;
    }
}
