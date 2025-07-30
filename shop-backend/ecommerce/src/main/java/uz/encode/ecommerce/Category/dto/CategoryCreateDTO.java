package uz.encode.ecommerce.Category.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CategoryCreateDTO {
    private String name;
    private UUID parentId; // optional
}