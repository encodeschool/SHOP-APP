package uz.encode.ecommerce.Inventory.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class InventoryTransactionDTO {
    private UUID id;
    private String productName;
    private String warehouseName;
    private String type;
    private Integer quantity;
    private String reason;
    private LocalDateTime createdAt;
}
