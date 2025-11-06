package uz.encode.ecommerce.WebComponents.Widgets.entity;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.encode.ecommerce.Category.entity.Category;

@Entity
@Table(name = "home_widgets")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomeWidget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String widgetType; // e.g., "CATEGORY_SECTION", "BANNER", "PRODUCT_SLIDER"

    private Integer orderIndex; // to sort order

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnore // Prevent serialization of the Category object
    private Category category; // if widgetType is CATEGORY_SECTION

    // Transient getter for categoryId in JSON response
    // @JsonProperty("category")
    // public UUID getCategoryId() {
    //     return category != null ? category.getId() : null;
    // }

    private String backgroundColor; // e.g., "pinkish", "bg-white"

    private String iconName; // e.g., "GiCow" or any lucide icon key

    private boolean active = true;

    // optional JSON field for future dynamic configs
    @Column(columnDefinition = "TEXT")
    private String configJson;

    // getters/setters
}
