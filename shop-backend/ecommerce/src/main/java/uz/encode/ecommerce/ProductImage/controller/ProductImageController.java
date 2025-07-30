package uz.encode.ecommerce.ProductImage.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import uz.encode.ecommerce.ProductImage.service.ProductImageService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products/{productId}/images")
@RequiredArgsConstructor
@Tag(name = "Product Images", description = "Product Image API")
public class ProductImageController {

    private final ProductImageService productImageService;

    @Operation(summary = "Upload Image")
    @PostMapping
    public ResponseEntity<List<String>> uploadImages(
            @PathVariable UUID productId,
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(productImageService.uploadImages(productId, files));
    }

    @Operation(summary = "Get Image by Product ID")
    @GetMapping
    public ResponseEntity<List<String>> getImages(@PathVariable UUID productId) {
        return ResponseEntity.ok(productImageService.getImageUrlsByProduct(productId));
    }

    @Operation(summary = "Delete Image By ID")
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable UUID imageId) {
        productImageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
}
