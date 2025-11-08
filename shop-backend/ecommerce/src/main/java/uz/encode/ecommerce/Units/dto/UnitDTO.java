package uz.encode.ecommerce.Units.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class UnitDTO {
    private Long id;
    private String name;
    private String code;
}
