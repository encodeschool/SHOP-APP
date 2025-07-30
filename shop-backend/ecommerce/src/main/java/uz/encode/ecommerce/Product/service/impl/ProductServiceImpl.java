package uz.encode.ecommerce.Product.service.impl;

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
import uz.encode.ecommerce.Category.entity.Category;
import uz.encode.ecommerce.Category.repository.CategoryRepository;
import uz.encode.ecommerce.Product.dto.ProductCreateDTO;
import uz.encode.ecommerce.Product.dto.ProductResponseDTO;
import uz.encode.ecommerce.Product.entity.Product;
import uz.encode.ecommerce.Product.repository.ProductRepository;
import uz.encode.ecommerce.Product.service.ProductService;
import uz.encode.ecommerce.ProductImage.entity.ProductImage;
import uz.encode.ecommerce.User.entity.User;
import uz.encode.ecommerce.User.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    @Value("${upload.path}")
    private String uploadFolderPath;

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public ProductResponseDTO create(ProductCreateDTO dto, List<MultipartFile> images) throws IOException {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setAvailable(dto.getQuantity() > 0);
        product.setStock(dto.getQuantity());
        product.setCondition(dto.getCondition());
        product.setUser(user);
        product.setCategory(category);
        product.setFeatured(dto.isFeatured());

        // Save product first to get ID
        Product savedProduct = productRepository.save(product);

        if (images != null && !images.isEmpty()) {
            Path uploadPath = Paths.get(uploadFolderPath);
            Files.createDirectories(uploadPath); // Ensure folder exists

            for (MultipartFile image : images) {
                String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path filePath = uploadPath.resolve(filename); // <-- build full file path

                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                ProductImage productImage = new ProductImage();
                productImage.setUrl("/images/" + filename);

                savedProduct.addImage(productImage);
            }

            productRepository.save(savedProduct);
        }


        return mapToDto(savedProduct);
    }

    @Override
    public List<ProductResponseDTO> getAll() {
        return productRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ProductResponseDTO getById(UUID id) {
        return mapToDto(productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found")));
    }

    @Override
    public List<ProductResponseDTO> getByUser(UUID userId) {
        return productRepository.findByUserId(userId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<ProductResponseDTO> getByCategory(UUID categoryId) {
        return productRepository.findByCategoryId(categoryId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ProductResponseDTO update(UUID id, ProductCreateDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setAvailable(dto.getQuantity() > 0);
        product.setStock(dto.getQuantity());
        product.setCondition(dto.getCondition());

        if (!product.getCategory().getId().equals(dto.getCategoryId())) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        return mapToDto(productRepository.save(product));
    }

    @Override
    public void delete(UUID id) {
        productRepository.deleteById(id);
    }

    private ProductResponseDTO mapToDto(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setAvailable(product.isAvailable());
        dto.setStock(product.getStock());
        dto.setCondition(product.getCondition());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUser(product.getUser());
        dto.setCategoryId(product.getCategory().getId());
        dto.setFeatured(product.isFeatured());
        dto.setImageUrls(
                product.getImages().stream().map(ProductImage::getUrl).toList()
        );
        return dto;
    }

    @Override
    public List<ProductResponseDTO> getFeatured() {
        return productRepository.findByFeaturedTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
}
