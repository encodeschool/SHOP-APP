package uz.encode.ecommerce.GEO.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.GEO.entity.City;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findByCountryCode(String countryCode);

    List<City> findByCountryCodeAndActiveTrue(String countryCode);
}

