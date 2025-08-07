package uz.encode.ecommerce.Product.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Data;
import uz.encode.ecommerce.Product.entity.ProductCondition;
import uz.encode.ecommerce.User.entity.User;

@Data
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

}
