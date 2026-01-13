package uz.encode.ecommerce.GEO.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.GEO.entity.PostalCode;

@Repository
public interface PostalCodeRepository extends JpaRepository<PostalCode, Long> {
    List<PostalCode> findByCountryCodeAndCity(String countryCode, String city);

    List<PostalCode> findByCountryCodeAndCityAndActiveTrue(String countryCode, String city);
}
