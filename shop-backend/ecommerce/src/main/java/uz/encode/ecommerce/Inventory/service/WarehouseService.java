package uz.encode.ecommerce.Inventory.service;


import java.util.List;
import java.util.UUID;

import uz.encode.ecommerce.Inventory.dto.WarehouseRequestDTO;
import uz.encode.ecommerce.Inventory.dto.WarehouseResponseDTO;

public interface WarehouseService {

    WarehouseResponseDTO create(WarehouseRequestDTO dto);

    WarehouseResponseDTO getById(UUID id);

    List<WarehouseResponseDTO> getAll();

    WarehouseResponseDTO update(UUID id, WarehouseRequestDTO dto);

    void delete(UUID id);
}