package uz.encode.ecommerce.Currency.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CurrencyResponseDTO {
    private Long id;
    private String code;
    private String name;
    private String symbol;
    private boolean active;
}
