package uz.encode.ecommerce.GEO.dto;

import lombok.Data;

@Data
public class PostalCodeDTO {
    private Long id;
    private String code;
    private String city;
    private String countryCode;
    private boolean active;
}
