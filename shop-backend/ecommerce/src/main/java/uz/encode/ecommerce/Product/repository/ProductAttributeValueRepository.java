package uz.encode.ecommerce.Product.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.Product.entity.Product;
import uz.encode.ecommerce.Product.entity.ProductAttributeValue;

@Repository
public interface ProductAttributeValueRepository extends JpaRepository<ProductAttributeValue, UUID> {

    ProductAttributeValue deleteByProduct(Product product);

    List<ProductAttributeValue> findByProductId(UUID productId);
    
}
