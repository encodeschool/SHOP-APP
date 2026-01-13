package uz.encode.ecommerce.GEO.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.GEO.dto.CityDTO;
import uz.encode.ecommerce.GEO.dto.CountryDTO;
import uz.encode.ecommerce.GEO.dto.PostalCodeDTO;
import uz.encode.ecommerce.GEO.entity.City;
import uz.encode.ecommerce.GEO.entity.Country;
import uz.encode.ecommerce.GEO.entity.PostalCode;
import uz.encode.ecommerce.GEO.service.GeoService;

@RestController
@RequestMapping("/api/geo")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GeoController {

    private final GeoService geoService;

    @GetMapping("/countries")
    public List<Country> countries() {
        return geoService.getCountries();
    }

    @GetMapping("/cities")
    public List<City> cities(@RequestParam String countryCode) {
        return geoService.getCities(countryCode);
    }

    @GetMapping("/postal-codes")
    public List<PostalCode> postalCodes(
            @RequestParam String countryCode,
            @RequestParam String city
    ) {
        return geoService.getPostalCodes(countryCode, city);
    }

    @PostMapping("/countries")
    public Country addCountry(@RequestBody CountryDTO dto) {
        return geoService.createCountry(dto);
    }

    @PostMapping("/cities")
    public City addCity(@RequestBody CityDTO dto) {
        return geoService.createCity(dto);
    }

    @PostMapping("/postal-codes")
    public PostalCode addPostal(@RequestBody PostalCodeDTO dto) {
        return geoService.createPostalCode(dto);
    }

    @PutMapping("/countries/{id}")
    public void updateCountry(@PathVariable Long id, @RequestBody CountryDTO dto) {
        geoService.updateCountry(id, dto);
    }

    @PutMapping("/cities/{id}")
    public void updateCity(@PathVariable Long id, @RequestBody CityDTO dto) {
        geoService.updateCity(id, dto);
    }

    @PutMapping("/postal-codes/{id}")
    public void updatePostalCode(@PathVariable Long id, @RequestBody PostalCodeDTO dto) {
        geoService.updatePostalCode(id, dto);
    }

    @DeleteMapping("/countries/{id}")
    public void deleteCountry(@PathVariable Long id) {
        geoService.deleteCountry(id);
    }

    @DeleteMapping("/cities/{id}")
    public void deleteCity(@PathVariable Long id) {
        geoService.deleteCity(id);
    }

    @DeleteMapping("/postal-codes/{id}")
    public void deletePostalCode(@PathVariable Long id) {
        geoService.deletePostalCode(id);
    }

}
