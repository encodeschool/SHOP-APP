package uz.encode.ecommerce.Category.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import uz.encode.ecommerce.Category.dto.CategoryCreateDTO;
import uz.encode.ecommerce.Category.dto.CategoryResponseDTO;

@Service
public interface CategoryService {
    CategoryResponseDTO create(CategoryCreateDTO dto, MultipartFile multipartFile);
    CategoryResponseDTO getById(UUID id);
    List<CategoryResponseDTO> getAll();
    List<CategoryResponseDTO> getAll(String lang);
    List<CategoryResponseDTO> getRootCategories();
    CategoryResponseDTO update(UUID id, CategoryCreateDTO dto, MultipartFile multipartFile);
    void delete(UUID id);
    List<CategoryResponseDTO> getSubCategories(UUID id);
}
