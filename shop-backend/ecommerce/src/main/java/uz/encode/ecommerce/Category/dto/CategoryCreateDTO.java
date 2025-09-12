package uz.encode.ecommerce.Category.dto;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryCreateDTO {
    private String name;
    private String categoryCode;
    private UUID parentId; // optional
    private List<CategoryTranslationDTO> translations;

}