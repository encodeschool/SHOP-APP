package uz.encode.ecommerce.WebComponents.Widgets.repository;

import org.springframework.stereotype.Repository;

import uz.encode.ecommerce.WebComponents.Widgets.entity.HomeWidget;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HomeWidgetRepository extends JpaRepository<HomeWidget, Long> {

    List<HomeWidget> findAllByActiveTrueOrderByOrderIndexAsc();
    
}
