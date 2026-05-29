package uz.encode.ecommerce.Inventory.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Inventory.dto.InventoryTransactionDTO;
import uz.encode.ecommerce.Inventory.dto.StockResponseDTO;
import uz.encode.ecommerce.Inventory.dto.TransferRequestDTO;
import uz.encode.ecommerce.Inventory.entity.InventoryTransaction;
import uz.encode.ecommerce.Inventory.entity.InventoryType;
import uz.encode.ecommerce.Inventory.entity.Warehouse;
import uz.encode.ecommerce.Inventory.exception.InventoryException;
import uz.encode.ecommerce.Inventory.mapper.InventoryMapper;
import uz.encode.ecommerce.Inventory.repository.InventoryTransactionRepository;
import uz.encode.ecommerce.Inventory.repository.WarehouseRepository;
import uz.encode.ecommerce.Inventory.service.InventoryService;
import uz.encode.ecommerce.Order.entity.Order;
import uz.encode.ecommerce.Product.entity.Product;
import uz.encode.ecommerce.Product.repository.ProductRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryServiceImpl implements InventoryService {

    private final InventoryTransactionRepository inventoryRepo;
    private final ProductRepository productRepo;
    private final WarehouseRepository warehouseRepo;
    private final InventoryMapper mapper;

    @Override
    public void increaseStock(UUID productId, UUID warehouseId, Integer qty, String reason) {

        validateQty(qty);

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new InventoryException("Product not found"));

        Warehouse warehouse = warehouseRepo.findById(warehouseId)
                .orElseThrow(() -> new InventoryException("Warehouse not found"));

        InventoryTransaction tx = new InventoryTransaction();
        tx.setProduct(product);
        tx.setWarehouse(warehouse);
        tx.setType(InventoryType.IN);
        tx.setQuantity(qty);
        tx.setReason(reason);

        inventoryRepo.save(tx);
        refreshProductAvailability(product);
    }

    // ─────────────────────────────
    // DECREASE STOCK
    // ─────────────────────────────
    @Override
    public void decreaseStock(UUID productId, UUID warehouseId, Integer qty, String reason) {
        validateQty(qty);

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new InventoryException("Product not found"));

        Warehouse warehouse = warehouseRepo.findById(warehouseId)
                .orElseThrow(() -> new InventoryException("Warehouse not found"));

        int currentStock = inventoryRepo.getStock(productId, warehouseId);
        if (currentStock < qty) {
            throw new InventoryException(
                "Insufficient stock. Available: " + currentStock + ", requested: " + qty
            );
        }

        InventoryTransaction tx = new InventoryTransaction();
        tx.setProduct(product);
        tx.setWarehouse(warehouse);
        tx.setType(InventoryType.OUT);
        tx.setQuantity(qty);
        tx.setReason(reason);

        inventoryRepo.save(tx);
        refreshProductAvailability(product);
    }

    @Override
    public void decreaseStock(UUID productId, UUID warehouseId, Integer qty, Order order) {
        validateQty(qty);

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new InventoryException("Product not found"));

        Warehouse warehouse = warehouseRepo.findById(warehouseId)
                .orElseThrow(() -> new InventoryException("Warehouse not found"));

        int currentStock = inventoryRepo.getStock(productId, warehouseId);
        if (currentStock < qty) {
            throw new InventoryException(
                "Insufficient stock. Available: " + currentStock + ", requested: " + qty
            );
        }

        InventoryTransaction tx = new InventoryTransaction();
        tx.setProduct(product);
        tx.setWarehouse(warehouse);
        tx.setType(InventoryType.OUT);
        tx.setQuantity(qty);
        tx.setOrder(order);
        tx.setReason("Order deduction");

        inventoryRepo.save(tx);
        refreshProductAvailability(product);
    }

    // ─────────────────────────────
    // TRANSFER STOCK
    // ─────────────────────────────
    @Override
    public void transfer(TransferRequestDTO dto) {

        validateQty(dto.getQuantity());

        if (dto.getFromWarehouseId().equals(dto.getToWarehouseId())) {
            throw new InventoryException("Cannot transfer to same warehouse");
        }

        int stock = inventoryRepo.getStock(dto.getProductId(), dto.getFromWarehouseId());

        if (stock < dto.getQuantity()) {
            throw new InventoryException(
                "Insufficient stock. Available: " + stock + ", requested: " + dto.getQuantity()
            );
        }

        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new InventoryException("Product not found"));

        Warehouse from = warehouseRepo.findById(dto.getFromWarehouseId())
                .orElseThrow(() -> new InventoryException("From warehouse not found"));

        Warehouse to = warehouseRepo.findById(dto.getToWarehouseId())
                .orElseThrow(() -> new InventoryException("To warehouse not found"));

        // OUT
        InventoryTransaction out = new InventoryTransaction();
        out.setProduct(product);
        out.setWarehouse(from);
        out.setType(InventoryType.TRANSFER_OUT);
        out.setQuantity(dto.getQuantity());
        out.setReason("Transfer OUT");

        // IN
        InventoryTransaction in = new InventoryTransaction();
        in.setProduct(product);
        in.setWarehouse(to);
        in.setType(InventoryType.TRANSFER_IN);
        in.setQuantity(dto.getQuantity());
        in.setReason("Transfer IN");

        inventoryRepo.save(out);
        inventoryRepo.save(in);
    }

    @Override
    public int getStock(UUID productId, UUID warehouseId) {
        return inventoryRepo.getStock(productId, warehouseId);
    }

    @Override
    public int getTotalStock(UUID productId) {
        return inventoryRepo.getTotalStock(productId);
    }

    private void refreshProductAvailability(Product product) {
        int totalStock = inventoryRepo.getTotalStock(product.getId());
        product.setAvailable(totalStock > 0);
        productRepo.save(product);
    }

    private void validateQty(Integer qty) {
        if (qty == null || qty <= 0) {
            throw new InventoryException("Quantity must be greater than zero");
        }
    }

    @Override
    public List<StockResponseDTO> getStock() {
        return inventoryRepo.getStock();
    }

    @Override
    public List<InventoryTransactionDTO> getMovements() {
        return inventoryRepo.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    private int getStockForProduct(UUID productId, UUID warehouseId) {
        return inventoryRepo.getStock(productId, warehouseId);
    }
}