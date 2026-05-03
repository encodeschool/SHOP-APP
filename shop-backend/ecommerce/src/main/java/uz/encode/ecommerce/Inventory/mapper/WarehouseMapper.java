package uz.encode.ecommerce.Inventory.mapper;

import org.springframework.stereotype.Component;

import uz.encode.ecommerce.Inventory.dto.WarehouseRequestDTO;
import uz.encode.ecommerce.Inventory.dto.WarehouseResponseDTO;
import uz.encode.ecommerce.Inventory.entity.Warehouse;

@Component
public class WarehouseMapper {

    public Warehouse toEntity(WarehouseRequestDTO dto) {
        Warehouse w = new Warehouse();
        w.setName(dto.getName());
        w.setAddress(dto.getAddress());
        return w;
    }

    public WarehouseResponseDTO toDTO(Warehouse w) {
        return new WarehouseResponseDTO(
                w.getId(),
                w.getName(),
                w.getAddress()
        );
    }

    public void update(Warehouse w, WarehouseRequestDTO dto) {
        w.setName(dto.getName());
        w.setAddress(dto.getAddress());
    }
}