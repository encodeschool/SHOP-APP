package uz.encode.ecommerce.Analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryDistirbutionDTO {
    
    private String categoryName;
    private long productCount;

}
