package uz.encode.ecommerce.Payment.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.Payment.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    // Optional<Payment> findByOrderIdAndProviderAndStatus(UUID orderId, String provider, String status);
    // Optional<Payment> findByOrderIdAndClickPrepareId(UUID orderId, Integer clickPrepareId);

    Optional<Payment> findByOrder_IdAndProvider(UUID orderId, String provider);

    Optional<Payment> findByClickTransId(Long clickTransId);

    Optional<Payment> findByOrder_IdAndClickPrepareId(UUID orderId, String clickPrepareId);

    @Query("SELECT COUNT(p) FROM Payment p WHERE MONTH(p.paidAt) = :month AND YEAR(p.paidAt) = YEAR(CURRENT_DATE)")
    long countByMonth(int month);

    @Query("SELECT p.method as method, COUNT(p) as count FROM Payment p WHERE p.status = 'PAID' GROUP BY p.method")
    List<PaymentMethodCount> countByMethod();

    interface PaymentMethodCount {
        String getMethod();
        Long getCount();
    }
}
