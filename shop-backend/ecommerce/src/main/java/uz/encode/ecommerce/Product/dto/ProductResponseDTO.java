package uz.encode.ecommerce.Product.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.encode.ecommerce.Product.entity.ProductCondition;
import uz.encode.ecommerce.User.entity.User;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseDTO {
    private UUID id;
    private String title;
    private String description;
    private BigDecimal price;
    private int quantity;
    private boolean available;
    private Integer stock;
    private ProductCondition condition;
    private LocalDateTime createdAt;
    private User user;
    private UUID categoryId;
    private boolean featured; // Flag for featured products
    private List<String> imageUrls; // assuming images are stored by URL

    private List<AttributeValueResponseDTO> attributes; // 👈 add this

    private String brandName; // ✅ new
    private UUID brandId;     // optional
    private List<ProductTranslationDTO> translations = new ArrayList<>();

}
