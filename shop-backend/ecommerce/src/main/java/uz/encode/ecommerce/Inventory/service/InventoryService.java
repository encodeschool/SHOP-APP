package uz.encode.ecommerce.Inventory.service;

import java.util.List;
import java.util.UUID;

import uz.encode.ecommerce.Inventory.dto.InventoryTransactionDTO;
import uz.encode.ecommerce.Inventory.dto.StockResponseDTO;
import uz.encode.ecommerce.Inventory.dto.TransferRequestDTO;
import uz.encode.ecommerce.Order.entity.Order;

public interface InventoryService {

    void increaseStock(UUID productId, UUID warehouseId, Integer qty, String reason);

    void decreaseStock(UUID productId, UUID warehouseId, Integer qty, Order order);

    void transfer(TransferRequestDTO dto);

    List<StockResponseDTO> getStock();

    List<InventoryTransactionDTO> getMovements();
}
