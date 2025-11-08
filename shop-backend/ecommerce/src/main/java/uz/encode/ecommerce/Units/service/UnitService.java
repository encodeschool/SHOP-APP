package uz.encode.ecommerce.Units.service;

import java.util.List;

import uz.encode.ecommerce.Units.dto.UnitCreateDTO;
import uz.encode.ecommerce.Units.dto.UnitDTO;
import uz.encode.ecommerce.Units.entity.Unit;

public interface UnitService {
    Unit getById(Long id);
    void save(UnitCreateDTO unit);
    void update(Long id, UnitCreateDTO unit);
    void delete(Long id);
    List<UnitDTO> findAll();
}
