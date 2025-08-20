package uz.encode.ecommerce.Product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttributeValueResponseDTO {
    private String attributeName;
    private String value;
}
