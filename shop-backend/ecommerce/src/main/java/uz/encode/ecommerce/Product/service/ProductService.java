package uz.encode.ecommerce.Product.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import uz.encode.ecommerce.Product.dto.AttributeValueDTO;
import uz.encode.ecommerce.Product.dto.ProductCreateDTO;
import uz.encode.ecommerce.Product.dto.ProductResponseDTO;
import uz.encode.ecommerce.Product.entity.Brand;
import uz.encode.ecommerce.Product.entity.ProductAttribute;

@Service
public interface ProductService {
    ProductResponseDTO create(ProductCreateDTO dto, List<MultipartFile> images) throws IOException;

    List<ProductResponseDTO> getAll();

    ProductResponseDTO getById(UUID id);

    ProductResponseDTO getById(UUID id, String lang);

    List<ProductResponseDTO> getByUser(UUID userId);

    List<ProductResponseDTO> getByCategory(UUID categoryId);

    ProductResponseDTO update(UUID id, ProductCreateDTO dto, List<MultipartFile> multipartFiles) throws IOException;

    void delete(UUID id);

    List<ProductResponseDTO> getFeatured(); // Add this

    List<ProductResponseDTO> getFiltered(List<String> brands, Boolean inStock, Double maxPrice, String sort);

    List<ProductAttribute> findByCategoryId(UUID categoryId);

    void saveAttributeValues(UUID productId, List<AttributeValueDTO> values);

    List<AttributeValueDTO> getAttributeValuesByProduct(UUID productId);

    ProductAttribute createAttribute(ProductAttribute productAttribute);

    List<Brand> getAllBrands();

    Optional<Brand> findBrandById(UUID brandId);

    Optional<Brand> findBrandByName(String brandName);

    Brand saveBrand(Brand brand, MultipartFile multipartFile);

    Brand updateBrand(UUID id, Brand updatedBrand, MultipartFile file);

    void deleteBrand(UUID id);

    List<ProductResponseDTO> search(String query);

    List<ProductResponseDTO> getAll(String lang);
}