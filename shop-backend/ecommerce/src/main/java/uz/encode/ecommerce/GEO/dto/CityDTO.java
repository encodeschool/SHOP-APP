package uz.encode.ecommerce.GEO.dto;

import lombok.Data;

@Data
public class CityDTO {
    private Long id;
    private String name;
    private String countryCode;
    private boolean active;
}
