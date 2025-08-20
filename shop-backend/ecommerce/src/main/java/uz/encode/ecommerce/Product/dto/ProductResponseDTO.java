package uz.encode.ecommerce.Product.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.encode.ecommerce.Product.entity.Product;
import uz.encode.ecommerce.Product.entity.ProductCondition;
import uz.encode.ecommerce.Product.entity.ProductTranslation;
import uz.encode.ecommerce.ProductImage.entity.ProductImage;
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
    private String lang;

    public ProductResponseDTO(Product product, String language) {
        this.id = product.getId();
        
        // Find translation for the requested language or fall back to default fields
        ProductTranslation translation = product.getTranslations().stream()
                .filter(t -> t.getLanguage().equalsIgnoreCase(language))
                .findFirst()
                .orElse(null);
        
        this.title = translation != null ? translation.getName() : product.getTitle();
        this.description = translation != null ? translation.getDescription() : product.getDescription();
        this.lang = language; // Set to null in JSON, but keeping language for clarity
        
        this.price = product.getPrice();
        this.quantity = product.getQuantity();
        this.available = product.isAvailable();
        this.stock = product.getStock();
        this.condition = product.getCondition() != null ? product.getCondition() : null;
        this.createdAt = product.getCreatedAt();
        this.user = product.getUser() != null ? product.getUser() : null;
        this.categoryId = product.getCategory() != null ? product.getCategory().getId() : null;
        this.featured = product.isFeatured();
        this.imageUrls = product.getImages().stream()
                .map(ProductImage::getUrl)
                .collect(Collectors.toList());
        this.brandName = product.getBrand() != null ? product.getBrand().getName() : null;
        this.brandId = product.getBrand() != null ? product.getBrand().getId() : null;
        this.attributes = product.getAttributes().stream()
                .map(attr -> new AttributeValueResponseDTO(attr.getAttribute().getName(), attr.getValue()))
                .collect(Collectors.toList());
        this.translations = product.getTranslations().stream()
                .map(ProductTranslationDTO::new)
                .collect(Collectors.toList());
    }

}
