package uz.encode.ecommerce.Units.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uz.encode.ecommerce.Units.dto.UnitCreateDTO;
import uz.encode.ecommerce.Units.dto.UnitDTO;
import uz.encode.ecommerce.Units.entity.Unit;
import uz.encode.ecommerce.Units.exception.UnitNotFoundException;
import uz.encode.ecommerce.Units.mapper.UnitMapper;
import uz.encode.ecommerce.Units.repository.UnitRepository;
import uz.encode.ecommerce.Units.service.UnitService;

@Service
public class UnitServiceImpl implements UnitService {

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private UnitMapper unitMapper;

    @Override
    public Unit getById(Long id) {
        return unitRepository.findById(id).orElseThrow(() -> new UnitNotFoundException("Unit not found by this ID: " + id));
    }

    @Override
    public void save(UnitCreateDTO unitCreateDTO) {
        Unit unit = unitMapper.toUnit(unitCreateDTO);
        unitRepository.save(unit);
    }

    @Override
    public List<UnitDTO> findAll() {
        return unitRepository.findAll().stream().map(unitMapper::toDto).toList();
    }
    
}
