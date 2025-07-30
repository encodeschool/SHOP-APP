package uz.encode.ecommerce.Address.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class AddressResponseDTO {
    private UUID id;
    private String city;
    private String region;
    private String street;
    private String zipCode;
    private UUID userId;
}
