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
    }

    @Override
    public void decreaseStock(UUID productId, UUID warehouseId, Integer qty, Order order) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new InventoryException("Product not found"));

        Warehouse warehouse = warehouseRepo.findById(warehouseId)
                .orElseThrow(() -> new InventoryException("Warehouse not found"));

        int currentStock = getStockForProduct(productId, warehouseId);

        if (currentStock < qty) {
            throw new InventoryException("Not enough stock");
        }

        InventoryTransaction tx = new InventoryTransaction();
        tx.setProduct(product);
        tx.setWarehouse(warehouse);
        tx.setType(InventoryType.OUT);
        tx.setQuantity(qty);
        tx.setOrder(order);
        tx.setReason("Order deduction");

        inventoryRepo.save(tx);
    }

    @Override
    public void transfer(TransferRequestDTO dto) {

        if (dto.getFromWarehouseId().equals(dto.getToWarehouseId())) {
            throw new InventoryException("Same warehouse transfer not allowed");
        }

        int stock = getStockForProduct(dto.getProductId(), dto.getFromWarehouseId());

        if (stock < dto.getQuantity()) {
            throw new InventoryException("Insufficient stock");
        }

        Product product = productRepo.findById(dto.getProductId()).orElseThrow();
        Warehouse from = warehouseRepo.findById(dto.getFromWarehouseId()).orElseThrow();
        Warehouse to = warehouseRepo.findById(dto.getToWarehouseId()).orElseThrow();

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

        List<InventoryTransaction> list =
                inventoryRepo.findAll().stream()
                        .filter(t ->
                                t.getProduct().getId().equals(productId)
                                && t.getWarehouse().getId().equals(warehouseId))
                        .toList();

        return list.stream()
                .mapToInt(t -> {
                    if (t.getType() == InventoryType.IN || t.getType() == InventoryType.TRANSFER_IN)
                        return t.getQuantity();
                    else
                        return -t.getQuantity();
                }).sum();
    }
}