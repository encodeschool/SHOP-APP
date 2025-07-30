package uz.encode.ecommerce.Product.service;
import uz.encode.ecommerce.Product.dto.ProductCreateDTO;
import uz.encode.ecommerce.Product.dto.ProductResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import uz.encode.ecommerce.Product.entity.Product;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public interface ProductService {
    ProductResponseDTO create(ProductCreateDTO dto, List<MultipartFile> images) throws IOException;
    List<ProductResponseDTO> getAll();
    ProductResponseDTO getById(UUID id);
    List<ProductResponseDTO> getByUser(UUID userId);
    List<ProductResponseDTO> getByCategory(UUID categoryId);
    ProductResponseDTO update(UUID id, ProductCreateDTO dto);
    void delete(UUID id);
    List<ProductResponseDTO> getFeatured(); // Add this
}