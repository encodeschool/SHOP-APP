package uz.encode.ecommerce.Product.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.Product.entity.ProductTranslation;

@Repository
public interface ProductTranslationRepository extends JpaRepository<ProductTranslation, UUID> {
    
}
