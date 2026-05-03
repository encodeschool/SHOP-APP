package uz.encode.ecommerce.Inventory.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Inventory.dto.WarehouseRequestDTO;
import uz.encode.ecommerce.Inventory.dto.WarehouseResponseDTO;
import uz.encode.ecommerce.Inventory.service.WarehouseService;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WarehouseController {

    private final WarehouseService service;

    @PostMapping
    public WarehouseResponseDTO create(@RequestBody WarehouseRequestDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<WarehouseResponseDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public WarehouseResponseDTO getById(@PathVariable UUID id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public WarehouseResponseDTO update(@PathVariable UUID id,
                                       @RequestBody WarehouseRequestDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}