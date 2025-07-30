package uz.encode.ecommerce.ProductImage.service;

import org.springframework.web.multipart.MultipartFile;
import uz.encode.ecommerce.ProductImage.entity.ProductImage;

import java.util.List;
import java.util.UUID;

public interface ProductImageService {
    List<String> uploadImages(UUID productId, List<MultipartFile> files);
    List<String> getImageUrlsByProduct(UUID productId);
    void deleteImage(UUID imageId);
}