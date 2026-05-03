package uz.encode.ecommerce.Inventory.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransferRequestDTO {
    private UUID productId;
    private UUID fromWarehouseId;
    private UUID toWarehouseId;
    private Integer quantity;
}
