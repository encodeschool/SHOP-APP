package uz.encode.ecommerce.Inventory.dto;


import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class WarehouseResponseDTO {
    private UUID id;
    private String name;
    private String address;
}
