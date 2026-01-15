package uz.encode.ecommerce.Product.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.encode.ecommerce.Product.entity.ProductCondition;
import uz.encode.ecommerce.Units.entity.Unit;

@Data
@AllArgsConstructor
@NoArgsConstructor
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

    private Integer stock;

    @NotNull
    private ProductCondition condition;

    @NotNull
    private UUID userId;

    @NotNull
    private UUID categoryId;

    private boolean featured;

    private Long unitId;  // ✅ must exist and match JSON key

    private List<AttributeValueDTO> attributes; // 👈 add this

    private UUID brandId; // ✅ new

    private List<ProductTranslationDTO> translations = new ArrayList<>();

    private LocationResponseDTO location;

    private Long currencyId;
}