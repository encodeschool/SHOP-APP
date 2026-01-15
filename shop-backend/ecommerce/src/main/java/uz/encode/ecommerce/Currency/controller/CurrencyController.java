package uz.encode.ecommerce.Currency.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.AllArgsConstructor;
import uz.encode.ecommerce.Currency.dto.CurrencyDTO;
import uz.encode.ecommerce.Currency.entity.Currency;
import uz.encode.ecommerce.Currency.service.CurrencyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/currency")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class CurrencyController {
    
    private final CurrencyService currencyService;

    @GetMapping
    public List<Currency> getAll() {
        return currencyService.getAll();
    }

    @GetMapping("/{code}")
    public Currency getByCode(@PathVariable String code) {
        return currencyService.getByCode(code);
    }

    @PostMapping
    public Currency create(@RequestBody CurrencyDTO dto) {
        return currencyService.create(dto);
    }

    @PutMapping("/{id}")
    public Currency update(@PathVariable Long id, @RequestBody CurrencyDTO dto) {
        return currencyService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        currencyService.delete(id);
    }
    

}
