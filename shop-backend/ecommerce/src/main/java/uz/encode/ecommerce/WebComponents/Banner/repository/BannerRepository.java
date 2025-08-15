package uz.encode.ecommerce.WebComponents.Banner.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.WebComponents.Banner.entity.Banner;

@Repository
public interface BannerRepository extends JpaRepository<Banner, UUID> {
    
}
