package uz.encode.ecommerce.Category.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import uz.encode.ecommerce.Category.dto.CategoryCreateDTO;
import uz.encode.ecommerce.Category.dto.CategoryResponseDTO;
import uz.encode.ecommerce.Category.entity.Category;

import java.util.List;
import java.util.UUID;

@Service
public interface CategoryService {
    CategoryResponseDTO create(CategoryCreateDTO dto, MultipartFile multipartFile);
    CategoryResponseDTO getById(UUID id);
    List<CategoryResponseDTO> getAll();
    List<CategoryResponseDTO> getRootCategories();
    CategoryResponseDTO update(UUID id, CategoryCreateDTO dto, MultipartFile multipartFile);
    void delete(UUID id);
    List<CategoryResponseDTO> getSubCategories(UUID id);
}
