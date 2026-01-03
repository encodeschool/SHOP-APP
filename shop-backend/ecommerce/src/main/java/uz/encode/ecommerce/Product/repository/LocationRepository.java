package uz.encode.ecommerce.Product.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.Product.entity.Location;

@Repository
public interface LocationRepository extends JpaRepository<Location, UUID> {
    
}
