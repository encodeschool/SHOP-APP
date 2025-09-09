package uz.encode.ecommerce.Product.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import uz.encode.ecommerce.Product.dto.AttributeTranslationDTO;
import uz.encode.ecommerce.Product.dto.AttributeValueDTO;
import uz.encode.ecommerce.Product.dto.ProductAttributeDTO;
import uz.encode.ecommerce.Product.dto.ProductCreateDTO;
import uz.encode.ecommerce.Product.dto.ProductResponseDTO;
import uz.encode.ecommerce.Product.entity.Brand;

@Service
public interface ProductService {
    ProductResponseDTO create(ProductCreateDTO dto, List<MultipartFile> images) throws IOException;
    
    List<ProductResponseDTO> getAll();

    List<ProductResponseDTO> getAll(String lang);

    ProductResponseDTO getById(UUID id);

    ProductResponseDTO getById(UUID id, String lang);

    List<ProductResponseDTO> getByUser(UUID userId);

    List<ProductResponseDTO> getByCategory(UUID categoryId);

    ProductResponseDTO update(UUID id, ProductCreateDTO dto, List<MultipartFile> images) throws IOException;

    void delete(UUID id);

    List<ProductResponseDTO> getFeatured();

    Page<ProductResponseDTO> getFiltered(List<String> brands, Boolean inStock, Double maxPrice, String sort, Pageable pageable);

    List<ProductAttributeDTO> findByCategoryId(UUID categoryId); // UPDATED: Use DTO

    void saveAttributeValues(UUID productId, List<AttributeValueDTO> values);

    List<AttributeValueDTO> getAttributeValuesByProduct(UUID productId);

    ProductAttributeDTO createAttribute(ProductAttributeDTO productAttribute); // UPDATED: Use DTO

    void saveAttributeTranslations(UUID attributeId, List<AttributeTranslationDTO> translations);

    List<Brand> getAllBrands();

    Optional<Brand> findBrandById(UUID brandId);

    Optional<Brand> findBrandByName(String brandName);

    Brand saveBrand(Brand brand, MultipartFile multipartFile);

    Brand updateBrand(UUID id, Brand updatedBrand, MultipartFile file);

    void deleteBrand(UUID id);

    List<ProductResponseDTO> search(String query);

}