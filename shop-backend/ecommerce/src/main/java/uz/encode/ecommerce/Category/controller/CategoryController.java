package uz.encode.ecommerce.Category.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Category.dto.CategoryCreateDTO;
import uz.encode.ecommerce.Category.dto.CategoryResponseDTO;
import uz.encode.ecommerce.Category.dto.CategoryTranslationDTO;
import uz.encode.ecommerce.Category.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Category", description = "Recursive category tree")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;
    private final ObjectMapper objectMapper;

    @Operation(summary = "Save Category")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryResponseDTO> create(
            @RequestParam("name") String name,
            @RequestParam("categoryCode") String categoryCode,
            @RequestParam(value = "parentId", required = false) String parentId,
            @RequestPart(value = "icon", required = false) MultipartFile icon,
            @RequestParam(value = "translations", required = false) String translationsJson
    ) throws Exception {
        CategoryCreateDTO dto = new CategoryCreateDTO();
        dto.setName(name);
        dto.setCategoryCode(categoryCode);
        if (parentId != null && !parentId.isEmpty()) {
            dto.setParentId(UUID.fromString(parentId));
        }
        if (translationsJson != null && !translationsJson.isEmpty()) {
            List<CategoryTranslationDTO> translations = objectMapper.readValue(
                    translationsJson,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, CategoryTranslationDTO.class)
            );
            dto.setTranslations(translations);
        }
        return ResponseEntity.ok(categoryService.create(dto, icon));
    }

    @Operation(summary = "Get All Category")
    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @Operation(summary = "Get All Category with Language")
    @GetMapping("/lang")
    public ResponseEntity<List<CategoryResponseDTO>> getAll(@RequestParam(defaultValue = "en") String lang) {
        return ResponseEntity.ok(categoryService.getAll(lang));
    }

    @Operation(summary = "Get Root Category")
    @GetMapping("/root-categories")
    public ResponseEntity<List<CategoryResponseDTO>> getRootCategories() {
        return ResponseEntity.ok(categoryService.getRootCategories());
    }

    @Operation(summary = "Get Category By ID")
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.getById(id));
    }

    @Operation(summary = "Update Category by ID")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryResponseDTO> update(
            @PathVariable UUID id,
            @RequestParam("name") String name,
            @RequestParam("categoryCode") String categoryCode,
            @RequestParam(value = "parentId", required = false) String parentId,
            @RequestPart(value = "icon", required = false) MultipartFile icon,
            @RequestParam(value = "translations", required = false) String translationsJson
    ) throws Exception {
        CategoryCreateDTO dto = new CategoryCreateDTO();
        dto.setName(name);
        dto.setCategoryCode(categoryCode);
        if (parentId != null && !parentId.isEmpty()) {
            dto.setParentId(UUID.fromString(parentId));
        }
        if (translationsJson != null && !translationsJson.isEmpty()) {
            List<CategoryTranslationDTO> translations = objectMapper.readValue(
                    translationsJson,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, CategoryTranslationDTO.class)
            );
            dto.setTranslations(translations);
        }
        return ResponseEntity.ok(categoryService.update(id, dto, icon));
    }

    @Operation(summary = "Delete Category By ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get Subcategories By Category ID")
    @GetMapping("/{id}/subcategories")
    public ResponseEntity<List<CategoryResponseDTO>> getSubcategories(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.getSubCategories(id));
    }

    @Operation(summary = "Search category")
    @GetMapping("/search/category")
    public ResponseEntity<List<CategoryResponseDTO>> search(@RequestParam String q, @RequestParam(defaultValue = "en") String lang) {
        return ResponseEntity.ok(categoryService.searchForCategory(q, lang));
    }
}