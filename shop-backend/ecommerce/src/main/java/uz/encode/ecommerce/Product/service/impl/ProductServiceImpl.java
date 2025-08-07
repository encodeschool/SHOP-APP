package uz.encode.ecommerce.Product.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Category.entity.Category;
import uz.encode.ecommerce.Category.repository.CategoryRepository;
import uz.encode.ecommerce.Product.dto.AttributeValueDTO;
import uz.encode.ecommerce.Product.dto.AttributeValueResponseDTO;
import uz.encode.ecommerce.Product.dto.ProductCreateDTO;
import uz.encode.ecommerce.Product.dto.ProductResponseDTO;
import uz.encode.ecommerce.Product.entity.Product;
import uz.encode.ecommerce.Product.entity.ProductAttribute;
import uz.encode.ecommerce.Product.entity.ProductAttributeValue;
import uz.encode.ecommerce.Product.repository.ProductAttributeRepository;
import uz.encode.ecommerce.Product.repository.ProductAttributeValueRepository;
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
    private final ProductAttributeRepository productAttributeRepository;
    private final ProductAttributeValueRepository productAttributeValueRepository;

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
        product.setStock(dto.getStock());
        product.setCondition(dto.getCondition());
        product.setUser(user);
        product.setCategory(category);
        product.setFeatured(dto.isFeatured());

        // Save product first to get ID
        Product savedProduct = productRepository.save(product);

        if (dto.getAttributes() != null) {
            for (AttributeValueDTO attrDto : dto.getAttributes()) {
                ProductAttribute attribute = productAttributeRepository.findById(attrDto.getAttributeId())
                    .orElseThrow(() -> new RuntimeException("Attribute not found"));

                ProductAttributeValue pav = new ProductAttributeValue();
                pav.setAttribute(attribute);
                pav.setValue(attrDto.getValue());
                pav.setProduct(savedProduct);

                savedProduct.getAttributes().add(pav);
            }
        }


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
        product.setStock(dto.getStock());
        product.setCondition(dto.getCondition());
        product.setFeatured(dto.isFeatured());

        if (!product.getCategory().getId().equals(dto.getCategoryId())) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        // Remove old attribute values
        productAttributeValueRepository.deleteByProduct(product);

        // Save new attribute values
        if (dto.getAttributes() != null) {
            for (AttributeValueDTO av : dto.getAttributes()) {
                ProductAttribute attribute = productAttributeRepository.findById(av.getAttributeId())
                        .orElseThrow(() -> new RuntimeException("Attribute not found"));

                ProductAttributeValue pav = new ProductAttributeValue();
                pav.setAttribute(attribute);
                pav.setProduct(product);
                pav.setValue(av.getValue());
                product.getAttributes().add(pav);
            }
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
        dto.setAttributes(
            product.getAttributes().stream()
                .map(attr -> {
                    AttributeValueResponseDTO attrDto = new AttributeValueResponseDTO();
                    attrDto.setAttributeName(attr.getAttribute().getName());
                    attrDto.setValue(attr.getValue());
                    return attrDto;
                }).collect(Collectors.toList())
        );
        return dto;
    }

    @Override
    public List<ProductResponseDTO> getFeatured() {
        return productRepository.findByFeaturedTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponseDTO> getFiltered(List<String> brands, Boolean inStock, Double maxPrice, String sort) {
        List<Product> products = productRepository.findAll();

        Stream<Product> stream = products.stream();

        if (brands != null && !brands.isEmpty()) {
            stream = stream.filter(p -> brands.contains(p.getBrand()));
        }

        if (inStock != null && inStock) {
            stream = stream.filter(Product::isInStock);
        }

        if (maxPrice != null) {
            stream = stream.filter(p -> p.getPrice().doubleValue() <= maxPrice);
        }

        if ("price-asc".equals(sort)) {
            stream = stream.sorted(Comparator.comparing(p -> p.getPrice().doubleValue()));
        } else if ("price-desc".equals(sort)) {
            stream = stream.sorted(Comparator.comparing((Product p) -> p.getPrice().doubleValue()).reversed());
        }

        return stream.map(this::mapToDto).toList();
    }

    @Override
    public List<ProductAttribute> findByCategoryId(UUID categoryId) {
        return productAttributeRepository.findByCategoryId(categoryId);
    }

    @Override
    public void saveAttributeValues(UUID productId, List<AttributeValueDTO> values) {
        Product product = productRepository.findById(productId)
        .orElseThrow(() -> new RuntimeException("Product not found"));

        List<ProductAttributeValue> attributeValues = values.stream().map(dto -> {
            ProductAttribute attribute = productAttributeRepository.findById(dto.getAttributeId())
                .orElseThrow(() -> new RuntimeException("Attribute not found"));
            return ProductAttributeValue.builder()
                .product(product)
                .attribute(attribute)
                .value(dto.getValue())
                .build();
        }).toList();

        productAttributeValueRepository.saveAll(attributeValues);
    }


    
}
