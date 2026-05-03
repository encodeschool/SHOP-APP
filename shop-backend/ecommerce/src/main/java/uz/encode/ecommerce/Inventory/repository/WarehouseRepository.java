package uz.encode.ecommerce.Inventory.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import uz.encode.ecommerce.Inventory.entity.Warehouse;

public interface WarehouseRepository extends JpaRepository<Warehouse, UUID> {
    
}
