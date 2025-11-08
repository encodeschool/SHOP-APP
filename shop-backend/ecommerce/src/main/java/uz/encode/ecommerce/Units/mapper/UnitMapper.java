package uz.encode.ecommerce.Units.mapper;

import org.springframework.stereotype.Component;

import uz.encode.ecommerce.Units.dto.UnitCreateDTO;
import uz.encode.ecommerce.Units.dto.UnitDTO;
import uz.encode.ecommerce.Units.entity.Unit;

@Component
public class UnitMapper {
    public UnitDTO toDto(Unit unit) {
        Long id = unit.getId();
        String name = unit.getName();
        String code = unit.getCode();
        return new UnitDTO(id, name, code);
    }

    public Unit toUnit(UnitCreateDTO unitCreateDTO) {
        return new Unit(unitCreateDTO.getId(), unitCreateDTO.getName(), unitCreateDTO.getCode());
    }
}
