package uz.encode.ecommerce.Product.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import uz.encode.ecommerce.Product.dto.ProductCreateDTO;
import uz.encode.ecommerce.Product.dto.ProductResponseDTO;
import uz.encode.ecommerce.Product.service.ProductService;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Product", description = "Product CRUD and search")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "Save Product with Images")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDTO> create(
        @RequestPart("product") ProductCreateDTO dto,
        @RequestPart("images") List<MultipartFile> images
    ) throws IOException {
        return ResponseEntity.ok(productService.create(dto, images));
    }

    @Operation(summary = "Get All Products")
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAll() {
        return ResponseEntity.ok(productService.getAll());
    }

    @Operation(summary = "Get Product By ID")
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @Operation(summary = "Get Product By User ID")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProductResponseDTO>> getByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(productService.getByUser(userId));
    }

    @Operation(summary = "Get Product By Category")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponseDTO>> getByCategory(@PathVariable UUID categoryId) {
        return ResponseEntity.ok(productService.getByCategory(categoryId));
    }

    @Operation(summary = "Update Product Details")
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> update(@PathVariable UUID id, @Valid @RequestBody ProductCreateDTO dto) {
        return ResponseEntity.ok(productService.update(id, dto));
    }

    @Operation(summary = "Delete Product By ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get Featured Products")
    @GetMapping("/featured")
    public ResponseEntity<List<ProductResponseDTO>> getFeatured() {
        return ResponseEntity.ok(productService.getFeatured());
    }
}
