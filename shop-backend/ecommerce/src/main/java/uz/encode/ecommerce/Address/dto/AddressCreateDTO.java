package uz.encode.ecommerce.Address.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddressCreateDTO {

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Region is required")
    private String region;

    @NotBlank(message = "Street is required")
    private String street;

    private String zipCode;

    @NotBlank(message = "User ID is required")
    private String userId;
}