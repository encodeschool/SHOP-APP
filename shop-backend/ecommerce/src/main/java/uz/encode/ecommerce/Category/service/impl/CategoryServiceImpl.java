package uz.encode.ecommerce.Category.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Category.dto.CategoryCreateDTO;
import uz.encode.ecommerce.Category.dto.CategoryResponseDTO;
import uz.encode.ecommerce.Category.entity.Category;
import uz.encode.ecommerce.Category.repository.CategoryRepository;
import uz.encode.ecommerce.Category.service.CategoryService;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    @Value("${upload.path}")
    private String uploadFolderPath;

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponseDTO create(CategoryCreateDTO dto, MultipartFile multipartFile) {
        Category category = new Category();
        category.setName(dto.getName());

        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParent(parent);
        }

        if (multipartFile != null && !multipartFile.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();
                Path uploadPath = Paths.get(uploadFolderPath);
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                category.setIcon("/images/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload icon.");
            }
        }

        return mapToDto(categoryRepository.save(category));
    }

    @Override
    public CategoryResponseDTO getById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return mapToDto(category);
    }

    @Override
    public List<CategoryResponseDTO> getAll() {
        return categoryRepository.findAll()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponseDTO> getRootCategories() {
        return categoryRepository.findByParentId(null)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public CategoryResponseDTO update(UUID id, CategoryCreateDTO dto, MultipartFile multipartFile) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(dto.getName());

        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent not found"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        if (multipartFile != null && !multipartFile.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();
                Path uploadPath = Paths.get(uploadFolderPath);
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                category.setIcon("/images/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload icon.");
            }
        }

        return mapToDto(categoryRepository.save(category));
    }

    @Override
    public void delete(UUID id) {
        categoryRepository.deleteById(id);
    }

    private CategoryResponseDTO mapToDto(Category category) {
        CategoryResponseDTO dto = new CategoryResponseDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setParentId(category.getParent() != null ? category.getParent().getId() : null);
        dto.setIcon(category.getIcon());
        if (category.getSubcategories() != null && !category.getSubcategories().isEmpty()) {
            dto.setSubcategories(
                    category.getSubcategories()
                            .stream().map(this::mapToDto)
                            .collect(Collectors.toList())
            );
        }
        return dto;
    }

    @Override
    public List<CategoryResponseDTO> getSubCategories(UUID id) {
        Category parent = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return parent.getSubcategories()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
}
