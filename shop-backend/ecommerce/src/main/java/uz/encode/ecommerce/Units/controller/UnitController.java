package uz.encode.ecommerce.Units.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import uz.encode.ecommerce.Units.dto.UnitCreateDTO;
import uz.encode.ecommerce.Units.dto.UnitDTO;
import uz.encode.ecommerce.Units.entity.Unit;
import uz.encode.ecommerce.Units.service.UnitService;

@RestController
@RequestMapping("/api/units")
@CrossOrigin(origins = "*")
public class UnitController {

    @Autowired
    private UnitService unitService;

    // ✅ Get all units
    @GetMapping
    public List<UnitDTO> getAll() {
        return unitService.findAll();
    }

    // ✅ Get one unit by ID
    @GetMapping("/{id}")
    public Unit getById(@PathVariable Long id) {
        return unitService.getById(id);
    }

    // ✅ Create new unit
    @PostMapping
    public void create(@RequestBody UnitCreateDTO unitCreateDTO) {
        unitService.save(unitCreateDTO);
    }

    // ✅ Update existing unit
    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody UnitCreateDTO unitCreateDTO) {
        unitService.update(id, unitCreateDTO);
    }

    // ✅ Delete a unit
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        unitService.delete(id);
    }
}
