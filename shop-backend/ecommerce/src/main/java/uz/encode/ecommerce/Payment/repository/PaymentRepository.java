package uz.encode.ecommerce.Payment.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.Payment.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    
}
