package uz.encode.ecommerce.Category.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.Category.dto.CategoryResponseDTO;
import uz.encode.ecommerce.Category.entity.Category;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByParentId(UUID parentId);
    
    @Query(
        """
           SELECT c FROM Category c
           LEFT JOIN c.translations t
           WHERE LOWER(COALESCE(t.name, c.name)) LIKE LOWER(CONCAT('%', :q, '%'))
           AND (t.language = :lang OR t.language IS NULL)    
        """
    )
    List<Category> findByNameInLanguageContainingIgnoreCase(
        @Param("q") String q,
        @Param("lang") String lang
    );

    List<Category> findByNameContainingIgnoreCase(String name);
}
