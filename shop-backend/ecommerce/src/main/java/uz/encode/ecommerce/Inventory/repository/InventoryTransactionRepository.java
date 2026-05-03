package uz.encode.ecommerce.Inventory.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import uz.encode.ecommerce.Inventory.dto.StockResponseDTO;
import uz.encode.ecommerce.Inventory.entity.InventoryTransaction;

public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, UUID> {

    List<InventoryTransaction> findByProductId(UUID productId);

    @Query("""
        SELECT new uz.encode.ecommerce.Inventory.dto.StockResponseDTO(
            p.id, p.title, w.id, w.name,
            COALESCE(SUM(
                CASE 
                    WHEN t.type = uz.encode.ecommerce.Inventory.entity.InventoryType.IN 
                        OR t.type = uz.encode.ecommerce.Inventory.entity.InventoryType.TRANSFER_IN 
                    THEN t.quantity

                    WHEN t.type = uz.encode.ecommerce.Inventory.entity.InventoryType.OUT 
                        OR t.type = uz.encode.ecommerce.Inventory.entity.InventoryType.TRANSFER_OUT 
                    THEN -t.quantity

                    ELSE 0
                END
            ), 0)
        )
        FROM InventoryTransaction t
        JOIN t.product p
        JOIN t.warehouse w
        GROUP BY p.id, p.title, w.id, w.name
    """)
    List<StockResponseDTO> getStock();

}