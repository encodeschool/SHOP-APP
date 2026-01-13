package uz.encode.ecommerce.GEO.dto;

import javax.management.monitor.StringMonitor;

import lombok.Data;

@Data
public class CountryDTO {
    private String code;
    private String name;
    private boolean active;
}
