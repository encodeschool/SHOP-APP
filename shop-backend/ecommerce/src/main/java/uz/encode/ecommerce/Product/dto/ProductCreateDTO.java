package uz.encode.ecommerce.Product.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import uz.encode.ecommerce.Product.entity.ProductCondition;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductCreateDTO {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    @Min(0)
    private int quantity;

    @NotNull
    private ProductCondition condition;

    @NotNull
    private UUID userId;

    @NotNull
    private UUID categoryId;

    private boolean featured;
}