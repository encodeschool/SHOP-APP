package uz.encode.ecommerce.Category.dto;

import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class CategoryCreateDTO {
    private String name;
    private UUID parentId; // optional
    private List<CategoryTranslationDTO> translations;

}