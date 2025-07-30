package uz.encode.ecommerce.Category.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CategoryResponseDTO {
    private UUID id;
    private String name;
    private UUID parentId;
    private String icon;
    private List<CategoryResponseDTO> subcategories;
}
