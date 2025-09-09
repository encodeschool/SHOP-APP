package uz.encode.ecommerce.Product.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import uz.encode.ecommerce.Category.entity.Category;
import uz.encode.ecommerce.Category.repository.CategoryRepository;
import uz.encode.ecommerce.Product.dto.AttributeTranslationDTO;
import uz.encode.ecommerce.Product.dto.AttributeValueDTO;
import uz.encode.ecommerce.Product.dto.AttributeValueResponseDTO;
import uz.encode.ecommerce.Product.dto.ProductAttributeDTO;
import uz.encode.ecommerce.Product.dto.ProductCreateDTO;
import uz.encode.ecommerce.Product.dto.ProductResponseDTO;
import uz.encode.ecommerce.Product.dto.ProductTranslationDTO;
import uz.encode.ecommerce.Product.entity.AttributeType;
import uz.encode.ecommerce.Product.entity.Brand;
import uz.encode.ecommerce.Product.entity.Product;
import uz.encode.ecommerce.Product.entity.ProductAttribute;
import uz.encode.ecommerce.Product.entity.ProductAttributeTranslation;
import uz.encode.ecommerce.Product.entity.ProductAttributeValue;
import uz.encode.ecommerce.Product.entity.ProductTranslation;
import uz.encode.ecommerce.Product.repository.BrandRepository;
import uz.encode.ecommerce.Product.repository.ProductAttributeRepository;
import uz.encode.ecommerce.Product.repository.ProductAttributeValueRepository;
import uz.encode.ecommerce.Product.repository.ProductRepository;
import uz.encode.ecommerce.Product.service.ProductService;
import uz.encode.ecommerce.ProductImage.entity.ProductImage;
import uz.encode.ecommerce.User.entity.User;
import uz.encode.ecommerce.User.repository.UserRepository;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Product.dto.ProductResponseDTO;
import uz.encode.ecommerce.Product.entity.Product;
import uz.encode.ecommerce.Product.repository.ProductRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Value("${upload.path}")
    private String uploadFolderPath;

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductAttributeRepository productAttributeRepository;
    @Autowired
    private ProductAttributeValueRepository productAttributeValueRepository;
    @Autowired
    private BrandRepository brandRepository;

    @Override
    @Transactional
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

        // Load and set brand
        Brand brand = brandRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        product.setBrand(brand);

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

                // UPDATED: Add translations for attribute value
                if (attrDto.getTranslations() != null) {
                    for (AttributeTranslationDTO tDto : attrDto.getTranslations()) {
                        ProductAttributeTranslation t = new ProductAttributeTranslation();
                        t.setLanguage(tDto.getLanguage());
                        t.setName(tDto.getName());
                        t.setAttributeValue(pav); // Link to attribute value
                        t.setAttribute(null); // Not for attribute name
                        pav.getTranslations().add(t);
                    }
                }

                savedProduct.getAttributes().add(pav);
            }
        }

        if (dto.getTranslations() != null) {
            for (ProductTranslationDTO translationDto : dto.getTranslations()) {
                ProductTranslation translation = new ProductTranslation();
                translation.setLanguage(translationDto.getLanguage());
                translation.setName(translationDto.getName());
                translation.setDescription(translationDto.getDescription());
                translation.setProduct(product);
                product.getTranslations().add(translation); // Add to existing collection
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
    @Transactional
    public ProductResponseDTO update(UUID id, ProductCreateDTO dto, List<MultipartFile> images) throws IOException {
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

        // Load and set brand
        Brand brand = brandRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        product.setBrand(brand);

        // Change category if different
        if (!product.getCategory().getId().equals(dto.getCategoryId())) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        // Clear old attribute values
        product.getAttributes().clear();

        // Add new attribute values
        if (dto.getAttributes() != null) {
            for (AttributeValueDTO av : dto.getAttributes()) {
                ProductAttribute attribute = productAttributeRepository.findById(av.getAttributeId())
                        .orElseThrow(() -> new RuntimeException("Attribute not found"));

                ProductAttributeValue pav = new ProductAttributeValue();
                pav.setAttribute(attribute);
                pav.setProduct(product);
                pav.setValue(av.getValue());

                // UPDATED: Add translations for attribute value
                if (av.getTranslations() != null) {
                    for (AttributeTranslationDTO tDto : av.getTranslations()) {
                        ProductAttributeTranslation t = new ProductAttributeTranslation();
                        t.setLanguage(tDto.getLanguage());
                        t.setName(tDto.getName());
                        t.setAttributeValue(pav); // Link to attribute value
                        t.setAttribute(null); // Not for attribute name
                        pav.getTranslations().add(t);
                    }
                }

                product.getAttributes().add(pav);
            }
        }

        if (images != null && !images.isEmpty()) {
            Path uploadPath = Paths.get(uploadFolderPath);
            Files.createDirectories(uploadPath); // Ensure folder exists

            for (MultipartFile image : images) {
                String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path filePath = uploadPath.resolve(filename);

                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                ProductImage productImage = new ProductImage();
                productImage.setUrl("/images/" + filename);
                productImage.setProduct(product); // set back reference

                product.getImages().add(productImage); // add to product's images
            }
        }

        // Handle translations
        if (dto.getTranslations() != null) {
            // Clear the existing translations (Hibernate will handle orphan removal)s
            product.getTranslations().clear();
            // Add new translations to the existing collection
            for (ProductTranslationDTO translationDto : dto.getTranslations()) {
                ProductTranslation translation = new ProductTranslation();
                translation.setLanguage(translationDto.getLanguage());
                translation.setName(translationDto.getName());
                translation.setDescription(translationDto.getDescription());
                translation.setProduct(product);
                product.getTranslations().add(translation);
            }
        } else {
            // Clear translations if none provided
            product.getTranslations().clear();
        }

        Product savedProduct = productRepository.save(product);

        return mapToDto(savedProduct);
    }

    @Override
    @Transactional
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
                product.getImages().stream().map(ProductImage::getUrl).toList());
        dto.setAttributes(
                product.getAttributes().stream()
                        .map(attr -> {
                            AttributeValueResponseDTO attrDto = new AttributeValueResponseDTO();
                            attrDto.setAttributeName(attr.getAttribute().getName());
                            attrDto.setValue(attr.getValue());
                            return attrDto;
                        }).collect(Collectors.toList()));
        // Add translations
        dto.setTranslations(
            product.getTranslations().stream()
                .map(t -> {
                    ProductTranslationDTO tDto = new ProductTranslationDTO();
                    tDto.setLanguage(t.getLanguage());
                    tDto.setName(t.getName());
                    tDto.setDescription(t.getDescription());
                    return tDto;
                }).collect(Collectors.toList()));
        // Add brand info
        if (product.getBrand() != null) {
            dto.setBrandName(product.getBrand().getName());
            dto.setBrandId(product.getBrand().getId());
        }
        return dto;
    }

    @Override
    public List<ProductResponseDTO> getFeatured() {
        return productRepository.findByFeaturedTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProductResponseDTO> getFiltered(List<String> brands, Boolean inStock, Double maxPrice, String sort, Pageable pageable) {
        // Create a Specification to build the dynamic query
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by brands
            if (brands != null && !brands.isEmpty()) {
                // CORRECTED: Compare the 'name' property of the Brand entity
                predicates.add(root.get("brand").get("name").in(brands));
            }

            // Filter by in-stock status
            if (inStock != null && inStock) {
                predicates.add(cb.isTrue(root.get("inStock")));
            }

            // Filter by maximum price
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            // Combine all predicates with AND logic
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Note: The 'sort' parameter from the request is handled by the Pageable object
        // passed from the controller, which automatically applies the sorting to the query.
        // We no longer need to manually sort with streams here.

        // Fetch the paginated and filtered results from the database
        Page<Product> productPage = productRepository.findAll(spec, pageable);

        // Map the page of Product entities to a page of ProductResponseDTOs
        return productPage.map(this::mapToDto);
    }

    @Override
    public List<ProductAttributeDTO> findByCategoryId(UUID categoryId) {
        Set<ProductAttribute> attributes = new HashSet<>();
        Category category = categoryRepository.findById(categoryId).orElseThrow();

        while (category != null) {
            attributes.addAll(productAttributeRepository.findAllByCategoryId(category.getId()));
            category = category.getParent();
        }

        return attributes.stream().map(attr -> {
            ProductAttributeDTO dto = new ProductAttributeDTO();
            dto.setId(attr.getId());
            dto.setName(attr.getName());
            dto.setType(attr.getType().name());
            dto.setRequired(attr.isRequired());
            dto.setCategoryId(attr.getCategory().getId());
            dto.setOptions(attr.getOptions());
            dto.setTranslations(attr.getTranslations().stream()
                    .map(t -> new AttributeTranslationDTO(t.getLanguage(), t.getName()))
                    .collect(Collectors.toList()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void saveAttributeValues(UUID productId, List<AttributeValueDTO> values) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<ProductAttributeValue> attributeValues = values.stream().map(dto -> {
            ProductAttribute attribute = productAttributeRepository.findById(dto.getAttributeId())
                    .orElseThrow(() -> new RuntimeException("Attribute not found"));
            ProductAttributeValue pav = ProductAttributeValue.builder()
                    .product(product)
                    .attribute(attribute)
                    .value(dto.getValue())
                    .build();

            // UPDATED: Add translations for attribute value in saveAttributeValues
            if (dto.getTranslations() != null) {
                for (AttributeTranslationDTO tDto : dto.getTranslations()) {
                    ProductAttributeTranslation t = new ProductAttributeTranslation();
                    t.setLanguage(tDto.getLanguage());
                    t.setName(tDto.getName());
                    t.setAttributeValue(pav);
                    t.setAttribute(null);
                    pav.getTranslations().add(t);
                }
            }

            return pav;
        }).toList();

        productAttributeValueRepository.saveAll(attributeValues);
    }

    @Override
    public List<AttributeValueDTO> getAttributeValuesByProduct(UUID productId) {
        return productAttributeValueRepository.findByProductId(productId)
                .stream()
                .map(value -> {
                    AttributeValueDTO dto = new AttributeValueDTO(value.getAttribute().getId(), value.getValue());

                    // UPDATED: Include translations in getAttributeValuesByProduct
                    List<AttributeTranslationDTO> translations = value.getTranslations().stream()
                            .map(t -> new AttributeTranslationDTO(t.getLanguage(), t.getName()))
                            .collect(Collectors.toList());
                    dto.setTranslations(translations);

                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ProductAttributeDTO createAttribute(ProductAttributeDTO productAttributeDTO) {
        if (productAttributeDTO.getCategoryId() == null) {
            throw new IllegalArgumentException("Category ID is required");
        }
        Category category = categoryRepository.findById(productAttributeDTO.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category ID not Found"));

        ProductAttribute productAttribute = new ProductAttribute();
        productAttribute.setName(productAttributeDTO.getName());
        productAttribute.setType(AttributeType.valueOf(productAttributeDTO.getType()));
        productAttribute.setRequired(productAttributeDTO.isRequired());
        productAttribute.setCategory(category);
        productAttribute.setOptions(productAttributeDTO.getOptions());

        // Handle translations
        if (productAttributeDTO.getTranslations() != null) {
            productAttribute.setTranslations(productAttributeDTO.getTranslations().stream()
                    .map(t -> {
                        ProductAttributeTranslation translation = new ProductAttributeTranslation();
                        translation.setLanguage(t.getLanguage());
                        translation.setName(t.getName());
                        translation.setAttribute(productAttribute);
                        translation.setAttributeValue(null);
                        return translation;
                    })
                    .collect(Collectors.toList()));
        }

        ProductAttribute savedAttribute = productAttributeRepository.save(productAttribute);

        ProductAttributeDTO result = new ProductAttributeDTO();
        result.setId(savedAttribute.getId());
        result.setName(savedAttribute.getName());
        result.setType(savedAttribute.getType().name());
        result.setRequired(savedAttribute.isRequired());
        result.setCategoryId(savedAttribute.getCategory().getId());
        result.setOptions(savedAttribute.getOptions());
        result.setTranslations(savedAttribute.getTranslations().stream()
                .map(t -> new AttributeTranslationDTO(t.getLanguage(), t.getName()))
                .collect(Collectors.toList()));

        return result;
    }

    @Override
    @Transactional
    public void saveAttributeTranslations(UUID attributeId, List<AttributeTranslationDTO> translations) {
        ProductAttribute attribute = productAttributeRepository.findById(attributeId)
                .orElseThrow(() -> new RuntimeException("Attribute not found"));

        attribute.getTranslations().clear();

        for (AttributeTranslationDTO tDto : translations) {
            ProductAttributeTranslation t = new ProductAttributeTranslation();
            t.setLanguage(tDto.getLanguage());
            t.setName(tDto.getName());
            t.setAttribute(attribute);
            t.setAttributeValue(null);
            attribute.getTranslations().add(t);
        }

        productAttributeRepository.save(attribute);
    }

    @Override
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @Override
    public Optional<Brand> findBrandById(UUID brandId) {
        return brandRepository.findById(brandId);
    }

    @Override
    public Optional<Brand> findBrandByName(String brandName) {
        return brandRepository.findByName(brandName);
    }

    @Override
    public Brand saveBrand(Brand brand, MultipartFile multipartFile) {
        if (multipartFile != null && !multipartFile.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();
                Path uploadPath = Paths.get(uploadFolderPath);
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                brand.setIcon("/images/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload icon");
            }
        }
        return brandRepository.save(brand);
    }

    @Override
    public Brand updateBrand(UUID id, Brand updatedBrand, MultipartFile file) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        brand.setName(updatedBrand.getName());

        if (file != null && !file.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path uploadPath = Paths.get(uploadFolderPath);
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                brand.setIcon("/images/" + fileName);
            } catch (IOException ex) {
                throw new RuntimeException("Failed to upload icon");
            }
        }

        return brandRepository.save(brand);
    }

    @Override
    public void deleteBrand(UUID id) {
        if (!brandRepository.existsById(id)) {
            throw new RuntimeException("Brand not found");
        }
        brandRepository.deleteById(id);
    }

    @Override
    public List<ProductResponseDTO> search(String query) {
        return productRepository
                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<ProductResponseDTO> getAll(String lang) {
        return productRepository.findAll().stream().map(product -> new ProductResponseDTO(product, lang)).collect(Collectors.toList());
    }

    @Override
    public ProductResponseDTO getById(UUID id, String lang) {
        Product product = productRepository.findById(id).orElseThrow();
        return new ProductResponseDTO(product, lang);
    }

}