package uz.encode.ecommerce.Inventory.service.impl;


import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Inventory.dto.WarehouseRequestDTO;
import uz.encode.ecommerce.Inventory.dto.WarehouseResponseDTO;
import uz.encode.ecommerce.Inventory.entity.Warehouse;
import uz.encode.ecommerce.Inventory.exception.ResourceNotFoundException;
import uz.encode.ecommerce.Inventory.mapper.WarehouseMapper;
import uz.encode.ecommerce.Inventory.repository.WarehouseRepository;
import uz.encode.ecommerce.Inventory.service.WarehouseService;

@Service
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository repository;
    private final WarehouseMapper mapper;

    @Override
    public WarehouseResponseDTO create(WarehouseRequestDTO dto) {
        Warehouse warehouse = mapper.toEntity(dto);
        return mapper.toDTO(repository.save(warehouse));
    }

    @Override
    public WarehouseResponseDTO getById(UUID id) {
        Warehouse w = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
        return mapper.toDTO(w);
    }

    @Override
    public List<WarehouseResponseDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WarehouseResponseDTO update(UUID id, WarehouseRequestDTO dto) {
        Warehouse w = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));

        mapper.update(w, dto);
        return mapper.toDTO(repository.save(w));
    }

    @Override
    public void delete(UUID id) {
        Warehouse w = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));

        repository.delete(w);
    }
}