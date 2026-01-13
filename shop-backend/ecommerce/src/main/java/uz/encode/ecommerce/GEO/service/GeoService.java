package uz.encode.ecommerce.GEO.service;

import java.util.List;

import uz.encode.ecommerce.GEO.dto.CityDTO;
import uz.encode.ecommerce.GEO.dto.CountryDTO;
import uz.encode.ecommerce.GEO.dto.PostalCodeDTO;
import uz.encode.ecommerce.GEO.entity.City;
import uz.encode.ecommerce.GEO.entity.Country;
import uz.encode.ecommerce.GEO.entity.PostalCode;

public interface GeoService {
    List<Country> getCountries();

    List<City> getCities(String countryCode);

    List<PostalCode> getPostalCodes(String countryCode, String city);

    Country createCountry(CountryDTO dto);

    City createCity(CityDTO dto);

    PostalCode createPostalCode(PostalCodeDTO dto);

    void updateCountry(Long id, CountryDTO dto);

    void updateCity(Long id, CityDTO dto);

    void updatePostalCode(Long id, PostalCodeDTO dto);

    void deleteCountry(Long id);

    void deleteCity(Long id);

    void deletePostalCode(Long id);
}
