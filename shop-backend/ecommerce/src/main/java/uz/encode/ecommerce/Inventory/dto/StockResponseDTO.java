package uz.encode.ecommerce.Inventory.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class StockResponseDTO {
    private UUID productId;
    private String productName;
    private UUID warehouseId;
    private String warehouseName;
    private Long quantity; 
}