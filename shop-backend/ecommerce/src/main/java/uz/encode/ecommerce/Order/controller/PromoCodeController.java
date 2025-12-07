package uz.encode.ecommerce.Order.controller;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Order.dto.PromoCodeDTO;
import uz.encode.ecommerce.Order.service.OrderService;
import uz.encode.ecommerce.Order.service.PromoCodeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/promo")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PromoCodeController {

    private final OrderService orderService;
    private final PromoCodeService promoCodeService;

    // GET ALL
    @GetMapping
    public List<PromoCodeDTO> getAllPromoCodes() {
        return promoCodeService.findAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public PromoCodeDTO getPromoById(@PathVariable Long id) {
        return promoCodeService.findById(id);
    }

    // CREATE
    @PostMapping
    public PromoCodeDTO createPromo(@RequestBody PromoCodeDTO dto) {
        return promoCodeService.create(dto);
    }

    // UPDATE
    @PutMapping("/{id}")
    public PromoCodeDTO updatePromo(@PathVariable Long id, @RequestBody PromoCodeDTO dto) {
        return promoCodeService.update(id, dto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromo(@PathVariable Long id) {
        promoCodeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // APPLY PROMO CODE
    @PostMapping("/apply")
    public ResponseEntity<Map<String, Object>> applyPromo(
            @RequestParam String code,
            @RequestParam BigDecimal total
    ) {
        BigDecimal newTotal = orderService.applyPromo(code, total);
        return ResponseEntity.ok(Map.of("newTotal", newTotal));
    }
}