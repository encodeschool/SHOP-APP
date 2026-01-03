package uz.encode.ecommerce.Product.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class LocationDTO {
    private String country;
    private String city;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
