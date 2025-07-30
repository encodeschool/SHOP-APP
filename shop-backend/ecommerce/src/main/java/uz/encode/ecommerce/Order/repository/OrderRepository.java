package uz.encode.ecommerce.Order.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
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
}
