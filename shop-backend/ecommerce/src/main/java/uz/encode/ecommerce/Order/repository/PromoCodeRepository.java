package uz.encode.ecommerce.Order.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import uz.encode.ecommerce.Order.entity.PromoCode;

import java.util.Optional;

public interface PromoCodeRepository extends JpaRepository<PromoCode, Long> {
    Optional<PromoCode> findByCodeIgnoreCase(String code);
}
