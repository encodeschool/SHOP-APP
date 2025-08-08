package uz.encode.ecommerce.Product.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Product.dto.AttributeValueDTO;
import uz.encode.ecommerce.Product.dto.ProductCreateDTO;
import uz.encode.ecommerce.Product.dto.ProductResponseDTO;
import uz.encode.ecommerce.Product.entity.Brand;
import uz.encode.ecommerce.Product.entity.ProductAttribute;
import uz.encode.ecommerce.Product.service.ProductService;

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

    @GetMapping("/filtered")
    public ResponseEntity<List<ProductResponseDTO>> getAllFiltered(
        @RequestParam(required = false) List<String> brands,
        @RequestParam(required = false) Boolean inStock,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(required = false) String sort
    ) {
        return ResponseEntity.ok(productService.getFiltered(brands, inStock, maxPrice, sort));
    }

    @GetMapping("/attributes/category/{categoryId}")
    public ResponseEntity<List<ProductAttribute>> getAttributesByCategory(@PathVariable UUID categoryId) {
        return ResponseEntity.ok(productService.findByCategoryId(categoryId));
    }

    @PostMapping("/attributes")
    public ResponseEntity<Void> saveAttributeValues(
        @RequestParam UUID productId,
        @RequestBody List<AttributeValueDTO> values
    ) {
        productService.saveAttributeValues(productId, values);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get attribute values for a product")
    @GetMapping("/attributes")
    public ResponseEntity<List<AttributeValueDTO>> getAttributeValuesByProduct(@RequestParam UUID productId) {
        return ResponseEntity.ok(productService.getAttributeValuesByProduct(productId));
    }

    @PostMapping("/create/attributes")
    public ResponseEntity<ProductAttribute> createAttribute(@RequestBody ProductAttribute productAttribute) {
        return ResponseEntity.ok(productService.createAttribute(productAttribute));
    }

    @GetMapping("/brands")
    public ResponseEntity<List<Brand>> getAllBrands() {
        return ResponseEntity.ok(productService.getAllBrands());
    }

    @PostMapping(value = "/brands", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Brand> saveBrand(@ModelAttribute Brand brand, @RequestPart MultipartFile multipartFile) {
        return ResponseEntity.ok(productService.saveBrand(brand, multipartFile));
    }

    @PutMapping(value = "/brands/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Brand> updateBrand(@PathVariable UUID id,
                                                @ModelAttribute Brand brand,
                                                @RequestPart(required = false) MultipartFile multipartFile) {
        return ResponseEntity.ok(productService.updateBrand(id, brand, multipartFile));
    }

    @DeleteMapping("/brands/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable UUID id) {
        productService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/brands/{id}")
    public ResponseEntity<Optional<Brand>> getBrandById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.findBrandById(id));
    }

}
