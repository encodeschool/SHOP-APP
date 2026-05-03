package uz.encode.ecommerce.Inventory.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Inventory.dto.InventoryTransactionDTO;
import uz.encode.ecommerce.Inventory.dto.StockResponseDTO;
import uz.encode.ecommerce.Inventory.dto.TransferRequestDTO;
import uz.encode.ecommerce.Inventory.service.InventoryService;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping("/increase")
    public void increase(@RequestParam UUID productId,
                         @RequestParam UUID warehouseId,
                         @RequestParam Integer qty,
                         @RequestParam String reason) {
        inventoryService.increaseStock(productId, warehouseId, qty, reason);
    }

    @PostMapping("/transfer")
    public void transfer(@RequestBody TransferRequestDTO dto) {
        inventoryService.transfer(dto);
    }

    @GetMapping("/stock")
    public List<StockResponseDTO> stock() {
        return inventoryService.getStock();
    }

    @GetMapping("/movements")
    public List<InventoryTransactionDTO> movements() {
        return inventoryService.getMovements();
    }
}