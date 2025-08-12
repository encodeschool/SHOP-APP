package uz.encode.ecommerce.User.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.Analytics.dto.MonthlyCountDTO;
import uz.encode.ecommerce.User.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    User getByEmail(String email);

    User findByUsername(String username);

    // @Query("SELECT new uz.encode.ecommerce.Analytics.dto.MonthlyCountDTO( " +
    // "FUNCTION('MONTHNAME', u.createdAt), COUNT(u)) " +
    // "FROM User u " +
    // "GROUP BY FUNCTION('MONTHNAME', u.createdAt), MONTH(u.createdAt) " +
    // "ORDER BY MONTH(u.createdAt)")
    // List<MonthlyCountDTO> countUsersGroupedByMonth();

}
