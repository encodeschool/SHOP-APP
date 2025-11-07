package uz.encode.ecommerce.Units.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uz.encode.ecommerce.Units.dto.UnitDTO;
import uz.encode.ecommerce.Units.entity.Unit;
import uz.encode.ecommerce.Units.service.UnitService;

@RestController
@RequestMapping("/api/units")
@CrossOrigin(origins = "*")
public class UnitController {
    
    @Autowired
    private UnitService unitService;

    @GetMapping
    public List<UnitDTO> getAll() {
        return unitService.findAll();
    }

}
