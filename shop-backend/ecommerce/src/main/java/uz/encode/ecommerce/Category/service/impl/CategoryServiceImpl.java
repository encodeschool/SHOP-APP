package uz.encode.ecommerce.Category.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Category.dto.CategoryCreateDTO;
import uz.encode.ecommerce.Category.dto.CategoryResponseDTO;
import uz.encode.ecommerce.Category.dto.CategoryTranslationDTO;
import uz.encode.ecommerce.Category.entity.Category;
import uz.encode.ecommerce.Category.entity.CategoryTranslation;
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
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Category name is required");
        }

        Category category = new Category();
        category.setName(dto.getName());

        // Validate and set parent
        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent category not found"));
            if (parent.getId().equals(category.getId())) {
                throw new IllegalArgumentException("Category cannot be its own parent");
            }
            category.setParent(parent);
        }

        // Handle icon upload
        if (multipartFile != null && !multipartFile.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();
                Path uploadPath = Paths.get(uploadFolderPath);
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                category.setIcon("/images/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload icon.", e);
            }
        }

        // Handle translations
        if (dto.getTranslations() != null && !dto.getTranslations().isEmpty()) {
            System.out.println("Creating translations: " + dto.getTranslations());
            Set<String> languages = new HashSet<>();
            List<CategoryTranslation> translations = dto.getTranslations().stream()
                    .filter(t -> t.getName() != null && !t.getName().trim().isEmpty())
                    .map(t -> {
                        if (!languages.add(t.getLanguage())) {
                            throw new IllegalArgumentException("Duplicate language in translations: " + t.getLanguage());
                        }
                        // Validate UTF-8
                        try {
                            t.getName().getBytes("UTF-8");
                        } catch (Exception e) {
                            throw new IllegalArgumentException("Invalid UTF-8 characters in translation: " + t.getName());
                        }
                        CategoryTranslation translation = new CategoryTranslation();
                        translation.setLanguage(t.getLanguage());
                        translation.setName(t.getName());
                        translation.setCategory(category);
                        return translation;
                    })
                    .collect(Collectors.toList());
            category.setTranslations(translations);
        }

        Category savedCategory = categoryRepository.save(category);
        System.out.println("Saved category: ID=" + savedCategory.getId() + ", Translations=" + savedCategory.getTranslations());
        return new CategoryResponseDTO(savedCategory, "en");
    }

    @Override
    public CategoryResponseDTO getById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return new CategoryResponseDTO(category, "en");
    }

    @Override
    public List<CategoryResponseDTO> getAll() {
        return getAll("en");
    }

    @Override
    public List<CategoryResponseDTO> getAll(String lang) {
        List<Category> categories = categoryRepository.findAll();
        // Log for debugging duplicates
        System.out.println("Raw categories from DB: " + categories.stream()
                .map(cat -> "ID=" + cat.getId() + ", Name=" + cat.getName() + ", ParentID=" + (cat.getParent() != null ? cat.getParent().getId() : null))
                .collect(Collectors.joining("; ")));

        // Deduplicate categories by ID
        Map<UUID, Category> uniqueCategories = new LinkedHashMap<>();
        for (Category category : categories) {
            if (uniqueCategories.containsKey(category.getId())) {
                System.err.println("Duplicate category ID found in DB: " + category.getId());
                continue;
            }
            uniqueCategories.put(category.getId(), category);
        }

        // Check for circular references
        for (Category category : uniqueCategories.values()) {
            if (hasCircularReference(category, new HashSet<>())) {
                System.err.println("Circular reference detected for category ID: " + category.getId());
            }
        }

        return uniqueCategories.values().stream()
                .map(category -> new CategoryResponseDTO(category, lang))
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponseDTO> getRootCategories() {
        return categoryRepository.findByParentId(null)
                .stream()
                .map(category -> new CategoryResponseDTO(category, "en"))
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponseDTO update(UUID id, CategoryCreateDTO dto, MultipartFile multipartFile) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            category.setName(dto.getName());
        }

        // Update parent
        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent category not found"));
            if (parent.getId().equals(id)) {
                throw new IllegalArgumentException("Category cannot be its own parent");
            }
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        // Update icon
        if (multipartFile != null && !multipartFile.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();
                Path uploadPath = Paths.get(uploadFolderPath);
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                category.setIcon("/images/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload icon.", e);
            }
        }

        // Update translations in-place
        if (dto.getTranslations() != null) {
            System.out.println("Updating translations: " + dto.getTranslations());
            // Create a map of existing translations for easier lookup
            Map<String, CategoryTranslation> existingTranslations = category.getTranslations().stream()
                    .collect(Collectors.toMap(CategoryTranslation::getLanguage, t -> t, (t1, t2) -> t1));

            // Clear translations that are no longer needed
            category.getTranslations().removeIf(t -> 
                dto.getTranslations().stream().noneMatch(dtoT -> dtoT.getLanguage().equals(t.getLanguage())));

            // Update or add new translations
            Set<String> languages = new HashSet<>();
            for (CategoryTranslationDTO translationDTO : dto.getTranslations()) {
                if (translationDTO.getName() == null || translationDTO.getName().trim().isEmpty()) {
                    continue;
                }
                if (!languages.add(translationDTO.getLanguage())) {
                    throw new IllegalArgumentException("Duplicate language in translations: " + translationDTO.getLanguage());
                }
                // Validate UTF-8
                try {
                    translationDTO.getName().getBytes("UTF-8");
                } catch (Exception e) {
                    throw new IllegalArgumentException("Invalid UTF-8 characters in translation: " + translationDTO.getName());
                }
                CategoryTranslation translation = existingTranslations.getOrDefault(translationDTO.getLanguage(), new CategoryTranslation());
                translation.setLanguage(translationDTO.getLanguage());
                translation.setName(translationDTO.getName());
                translation.setCategory(category);
                if (!category.getTranslations().contains(translation)) {
                    category.getTranslations().add(translation);
                }
            }
        } else {
            // If no translations provided, clear existing ones
            category.getTranslations().clear();
        }

        Category updatedCategory = categoryRepository.save(category);
        System.out.println("Updated category: ID=" + updatedCategory.getId() + ", Translations=" + updatedCategory.getTranslations());
        return new CategoryResponseDTO(updatedCategory, "en");
    }

    @Override
    public void delete(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }

    @Override
    public List<CategoryResponseDTO> getSubCategories(UUID id) {
        Category parent = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return parent.getSubcategories()
                .stream()
                .map(category -> new CategoryResponseDTO(category, "en"))
                .collect(Collectors.toList());
    }

    private boolean hasCircularReference(Category category, Set<UUID> seen) {
        if (category == null || category.getId() == null) return false;
        if (seen.contains(category.getId())) return true;
        seen.add(category.getId());
        if (category.getParent() != null) {
            return hasCircularReference(category.getParent(), new HashSet<>(seen));
        }
        return false;
    }
}