package uz.encode.ecommerce.Inventory.mapper;

import org.springframework.stereotype.Component;

import uz.encode.ecommerce.Inventory.dto.InventoryTransactionDTO;
import uz.encode.ecommerce.Inventory.entity.InventoryTransaction;

@Component
public class InventoryMapper {

    public InventoryTransactionDTO toDTO(InventoryTransaction tx) {
        return new InventoryTransactionDTO(
            tx.getId(),
            tx.getProduct().getTitle(),
            tx.getWarehouse().getName(),
            tx.getType().name(),
            tx.getQuantity(),
            tx.getReason(),
            tx.getCreatedAt()
        );
    }
}
