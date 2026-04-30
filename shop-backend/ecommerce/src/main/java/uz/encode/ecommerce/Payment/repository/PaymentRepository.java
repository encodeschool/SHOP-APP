package uz.encode.ecommerce.Payment.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.Payment.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    // Optional<Payment> findByOrderIdAndProviderAndStatus(UUID orderId, String provider, String status);
    // Optional<Payment> findByOrderIdAndClickPrepareId(UUID orderId, Integer clickPrepareId);

    Optional<Payment> findByOrder_IdAndProvider(UUID orderId, String provider);

    Optional<Payment> findByClickTransId(Long clickTransId);

Optional<Payment> findByOrder_IdAndClickPrepareId(UUID orderId, String clickPrepareId);}
