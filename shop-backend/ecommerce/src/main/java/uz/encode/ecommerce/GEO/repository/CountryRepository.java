package uz.encode.ecommerce.GEO.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.GEO.entity.Country;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {
    List<Country> findByActiveTrue();
}
