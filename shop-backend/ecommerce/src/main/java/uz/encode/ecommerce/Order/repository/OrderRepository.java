package uz.encode.ecommerce.Order.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.Analytics.dto.MonthlyCountDTO;
import uz.encode.ecommerce.Analytics.dto.MonthlyRevenueDTO;
import uz.encode.ecommerce.Analytics.dto.OrderStatusCountDTO;
import uz.encode.ecommerce.Analytics.dto.TopProductDTO;
import uz.encode.ecommerce.Category.entity.Category;
import uz.encode.ecommerce.Order.entity.Order;
import uz.encode.ecommerce.Order.entity.OrderStatus;
import uz.encode.ecommerce.Product.entity.Product;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
        List<Order> findByUserId(UUID userId);

        Page<Order> findAllByStatus(OrderStatus status, Pageable pageable);

        @Query("SELECT COUNT(o) FROM Order o WHERE MONTH(o.createdAt) = :month")
        long countByMonth(@Param("month") int month);

        @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o")
        double sumTotalRevenue();

        @Query("SELECT new uz.encode.ecommerce.Analytics.dto.OrderStatusCountDTO(o.status, COUNT(o)) " +
                        "FROM Order o GROUP BY o.status")
        List<OrderStatusCountDTO> countOrdersByStatus();


        @Query("SELECT new uz.encode.ecommerce.Analytics.dto.TopProductDTO(p.id, p.title, SUM(oi.quantity)) " +
                        "FROM OrderItem oi JOIN oi.product p GROUP BY p.id, p.title ORDER BY SUM(oi.quantity) DESC")
        List<TopProductDTO> findTopSellingProducts(Pageable pageable);

        // @Query("SELECT new uz.encode.ecommerce.Analytics.dto.MonthlyCountDTO( " +
        // "FUNCTION('MONTHNAME', o.createdAt), COUNT(o)) " +
        // "FROM Order o " +
        // "GROUP BY FUNCTION('MONTHNAME', o.createdAt), MONTH(o.createdAt) " +
        // "ORDER BY MONTH(o.createdAt)")
        // List<MonthlyCountDTO> countOrdersGroupedByMonth();

        @Query("""
                SELECT o FROM Order o JOIN o.user u
                WHERE (:status IS NULL OR o.status = :status)
                AND (
                        :query IS NULL OR :query = '' OR
                        str(o.id) LIKE %:query% OR
                        LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR
                        LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR
                        u.phone LIKE %:query%
                )
                """)
        Page<Order> findBySearchQueryAndStatus(@Param("query") String query,
                                        @Param("status") String status,
                                        Pageable pageable);


}
