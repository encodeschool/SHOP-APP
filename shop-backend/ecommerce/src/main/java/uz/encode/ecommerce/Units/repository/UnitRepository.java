package uz.encode.ecommerce.Units.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.Units.entity.Unit;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {
    
}
