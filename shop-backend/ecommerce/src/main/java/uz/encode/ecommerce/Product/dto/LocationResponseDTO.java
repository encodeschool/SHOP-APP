package uz.encode.ecommerce.Product.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.encode.ecommerce.Product.entity.Location;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationResponseDTO {
    private UUID id;
    private String country;
    private String city;
    private String address;
    private String region;
    private Double latitude;
    private Double longitude;
    private String source;

    public static LocationResponseDTO from(Location location) {
        if (location == null) return null;

        return new LocationResponseDTO(
            location.getId(),
            location.getCountry(),
            location.getCity(),
            location.getAddress(),
            location.getRegion(),
            location.getLatitude(),
            location.getLongitude(),
            location.getSource().name()
        );
    }
}
