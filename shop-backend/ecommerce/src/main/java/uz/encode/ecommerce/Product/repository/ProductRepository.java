package uz.encode.ecommerce.Product.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.Analytics.dto.CategoryDistirbutionDTO;
import uz.encode.ecommerce.Analytics.dto.MonthlyCountDTO;
import uz.encode.ecommerce.Analytics.dto.TopProductDTO;
import uz.encode.ecommerce.Product.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {
        List<Product> findByCategoryId(UUID categoryId);

        List<Product> findByUserId(UUID userId);

        List<Product> findByFeaturedTrue(); // Add this

        Product findByTitle(String title);

        @Query("SELECT COUNT(p) FROM Product p WHERE MONTH(p.createdAt) = :month")
        long countByMonth(@Param("month") int month);

        @Query("SELECT new uz.encode.ecommerce.Analytics.dto.CategoryDistirbutionDTO(c.name, COUNT(p)) FROM Product p JOIN p.category c GROUP BY c.name")
        List<CategoryDistirbutionDTO> countByCategory();

        // @Query("SELECT new uz.encode.ecommerce.Analytics.dto.MonthlyCountDTO( " +
        // "FUNCTION('MONTHNAME', p.createdAt), COUNT(p)) " +
        // "FROM Product p " +
        // "GROUP BY FUNCTION('MONTHNAME', p.createdAt), MONTH(p.createdAt) " +
        // "ORDER BY MONTH(p.createdAt)")
        // List<MonthlyCountDTO> countProductsGroupedByMonth();

        // @Query("SELECT new
        // uz.encode.ecommerce.Analytics.dto.CategoryDistributionDTO(c.name, COUNT(p)) "
        // +
        // "FROM Product p JOIN p.category c GROUP BY c.name")
        // List<CategoryDistirbutionDTO> countProductsByCategory();

        @Query("SELECT new uz.encode.ecommerce.Analytics.dto.TopProductDTO(p.id, p.title, SUM(oi.quantity)) " +
                        "FROM OrderItem oi JOIN oi.product p GROUP BY p.id, p.title ORDER BY SUM(oi.quantity) DESC")
        List<TopProductDTO> findTopSellingProducts(Pageable pageable);

        List<Product> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title,
                        String description);
}
