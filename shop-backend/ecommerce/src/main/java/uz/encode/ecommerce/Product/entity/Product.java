package uz.encode.ecommerce.Product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uz.encode.ecommerce.Category.entity.Category;
import uz.encode.ecommerce.ProductImage.entity.ProductImage;
import uz.encode.ecommerce.User.entity.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue
    private UUID id;

    private String title;

    @Column(length = 5000)
    private String description;

    private BigDecimal price;
    private int quantity;
    private boolean available = true;
    private boolean featured; // Flag for featured products

    private Integer stock;

    @Enumerated(EnumType.STRING)
    private ProductCondition condition;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductImage> images = new ArrayList<>();

     // Optional helper
    public void addImage(ProductImage image) {
        this.images.add(image);
        image.setProduct(this);
    }

}