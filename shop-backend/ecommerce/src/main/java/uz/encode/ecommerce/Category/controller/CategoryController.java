package uz.encode.ecommerce.Category.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import uz.encode.ecommerce.Category.dto.CategoryCreateDTO;
import uz.encode.ecommerce.Category.dto.CategoryResponseDTO;
import uz.encode.ecommerce.Category.service.CategoryService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Category", description = "Recursive category tree")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "Save Category")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryResponseDTO> create(@Valid @ModelAttribute CategoryCreateDTO dto, @RequestPart(value = "icon", required = false) MultipartFile multipartFile) {
        return ResponseEntity.ok(categoryService.create(dto, multipartFile));
    }

    @Operation(summary = "Get All Category")
    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
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
    public ResponseEntity<CategoryResponseDTO> update(@PathVariable UUID id, @Valid @ModelAttribute CategoryCreateDTO dto, @RequestPart(value = "icon", required = false) MultipartFile multipartFile) {
        return ResponseEntity.ok(categoryService.update(id, dto, multipartFile));
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
}