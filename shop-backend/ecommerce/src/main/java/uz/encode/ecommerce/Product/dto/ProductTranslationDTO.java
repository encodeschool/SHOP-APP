package uz.encode.ecommerce.Product.dto;

import lombok.Data;

@Data
public class ProductTranslationDTO {
    private String language;
    private String name;
    private String description;
}