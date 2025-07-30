package uz.encode.ecommerce.Category.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.Category.dto.CategoryResponseDTO;
import uz.encode.ecommerce.Category.entity.Category;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByParentId(UUID parentId);
}
