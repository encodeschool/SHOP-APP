package uz.encode.ecommerce.GEO.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.GEO.dto.CityDTO;
import uz.encode.ecommerce.GEO.dto.CountryDTO;
import uz.encode.ecommerce.GEO.dto.PostalCodeDTO;
import uz.encode.ecommerce.GEO.entity.City;
import uz.encode.ecommerce.GEO.entity.Country;
import uz.encode.ecommerce.GEO.entity.PostalCode;
import uz.encode.ecommerce.GEO.repository.CityRepository;
import uz.encode.ecommerce.GEO.repository.CountryRepository;
import uz.encode.ecommerce.GEO.repository.PostalCodeRepository;
import uz.encode.ecommerce.GEO.service.GeoService;

@Service
@RequiredArgsConstructor
public class GeoServiceImpl implements GeoService {

    private final CountryRepository countryRepo;
    private final CityRepository cityRepo;
    private final PostalCodeRepository postalRepo;

    @Override
    public List<Country> getCountries() {
        return countryRepo.findAll();
    }

    @Override
    public List<City> getCities(String countryCode) {
        return cityRepo.findByCountryCode(countryCode);
    }

    @Override
    public List<PostalCode> getPostalCodes(String countryCode, String city) {
        return postalRepo.findByCountryCodeAndCity(countryCode, city);
    }

    @Override
    public Country createCountry(CountryDTO dto) {
        return countryRepo.save(
            new Country(null, dto.getCode(), dto.getName(), dto.isActive())
        );
    }

    @Override
    public City createCity(CityDTO dto) {
        return cityRepo.save(
            new City(null, dto.getName(), dto.getCountryCode(), dto.isActive())
        );
    }

    @Override
    public PostalCode createPostalCode(PostalCodeDTO dto) {
        return postalRepo.save(
            new PostalCode(null, dto.getCode(), dto.getCity(), dto.getCountryCode(), dto.isActive())
        );
    }

    @Override
    public void updateCountry(Long id, CountryDTO dto) {
        Country country = getCountryById(id);

        if (dto.getName() != null) {
            country.setName(dto.getName());
        }

        if (!dto.isActive()) {
            country.setActive(dto.isActive());
        }

        countryRepo.save(country);
    }

    @Override
    public void updateCity(Long id, CityDTO dto) {
        City city = getCityById(id);

        if (dto.getName() != null) {
            city.setName(dto.getName());
        }

        if (dto.getCountryCode() != null) {
            city.setCountryCode(dto.getCountryCode());
        }

        if (!dto.isActive()) {
            city.setActive(true);
        }

        cityRepo.save(city);
    }

    @Override
    public void updatePostalCode(Long id, PostalCodeDTO dto) {
        PostalCode postalCode = getPostalCodeById(id);
        
        if (dto.getCode() != null) {
            postalCode.setCode(dto.getCode());
        }

        if (dto.getCity() != null) {
            postalCode.setCity(dto.getCity());
        }

        if (dto.getCountryCode() != null) {
            postalCode.setCountryCode(dto.getCountryCode());
        }

        if (!dto.isActive()) {
            postalCode.setActive(true);
        }

        postalRepo.save(postalCode);
    }

    @Override
    public void deleteCountry(Long id) {
        countryRepo.delete(getCountryById(id));
    }

    @Override
    public void deleteCity(Long id) {
        cityRepo.delete(getCityById(id));
    }

    @Override
    public void deletePostalCode(Long id) {
        postalRepo.delete(getPostalCodeById(id));
    }

    private Country getCountryById(Long id) {
        return countryRepo.findById(id).orElseThrow(() -> new RuntimeException("Country with this ID not found: " + id));
    }

    private City getCityById(Long id) {
        return cityRepo.findById(id).orElseThrow(() -> new RuntimeException("City with this ID not found: " + id));
    }

    private PostalCode getPostalCodeById(Long id) {
        return postalRepo.findById(id).orElseThrow(() -> new RuntimeException("Postal Code with this ID not found: " + id));
    }
}