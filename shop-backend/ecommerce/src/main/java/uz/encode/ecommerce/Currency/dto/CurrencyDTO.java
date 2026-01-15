package uz.encode.ecommerce.Currency.dto;

import java.util.UUID;

import lombok.Data;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class CurrencyDTO {

    @NotBlank(message = "Currency code is required")
    @Size(min = 3, max = 3, message = "Currency code must be 3 letters")
    private String code;

    @NotBlank(message = "Currency name is required")
    private String name;

    @NotBlank(message = "Currency symbol is required")
    private String symbol;

    private boolean active = true;
}
