package uz.encode.ecommerce.ProductImage.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import uz.encode.ecommerce.Product.entity.Product;
import uz.encode.ecommerce.Product.repository.ProductRepository;
import uz.encode.ecommerce.ProductImage.entity.ProductImage;
import uz.encode.ecommerce.ProductImage.repository.ProductImageRepository;
import uz.encode.ecommerce.ProductImage.service.ProductImageService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;

    @Value("${upload.path}")
    private String uploadPath; // e.g., "uploads/"

    @Override
    public List<String> uploadImages(UUID productId, List<MultipartFile> files) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<String> urls = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path targetPath = Path.of(uploadPath, filename).toAbsolutePath().normalize();
                Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

                ProductImage image = new ProductImage();
                image.setUrl("/images/" + filename);
                image.setProduct(product);
                productImageRepository.save(image);

                urls.add(image.getUrl());

            } catch (IOException e) {
                throw new RuntimeException("Failed to store image: " + file.getOriginalFilename(), e);
            }
        }

        return urls;
    }

    @Override
    public void deleteImage(UUID imageId) {
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // Delete the file
        String fileName = image.getUrl().replace("/images/", "");
        Path imagePath = Path.of(uploadPath, fileName).toAbsolutePath();

        try {
            Files.deleteIfExists(imagePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image file: " + fileName, e);
        }

        // Delete DB record
        productImageRepository.delete(image);
    }

    @Override
    public List<String> getImageUrlsByProduct(UUID productId) {
        return productImageRepository.findByProductId(productId)
                .stream()
                .map(ProductImage::getUrl)
                .toList();
    }
}