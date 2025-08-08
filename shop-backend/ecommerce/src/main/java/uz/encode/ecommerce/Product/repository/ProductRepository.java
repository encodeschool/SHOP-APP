package uz.encode.ecommerce.Product.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.Analytics.dto.CategoryDistirbutionDTO;
import uz.encode.ecommerce.Product.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByCategoryId(UUID categoryId);
    List<Product> findByUserId(UUID userId);
    List<Product> findByFeaturedTrue(); // Add this
    Product findByTitle(String title);

    @Query("SELECT COUNT(p) FROM Product p WHERE MONTH(p.createdAt) = :month")
    long countByMonth(@Param("month") int month);

    @Query("SELECT new uz.encode.ecommerce.Analytics.dto.CategoryDistirbutionDTO(c.name, COUNT(p)) FROM Product p JOIN p.category c GROUP BY c.name")
    List<CategoryDistirbutionDTO> countByCategory();

    List<Product> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
}
