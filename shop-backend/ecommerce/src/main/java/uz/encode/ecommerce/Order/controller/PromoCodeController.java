package uz.encode.ecommerce.Order.controller;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Order.dto.PromoCodeDTO;
import uz.encode.ecommerce.Order.entity.PromoCode;
import uz.encode.ecommerce.Order.repository.PromoCodeRepository;
import uz.encode.ecommerce.Order.service.OrderService;
import uz.encode.ecommerce.Order.service.PromoCodeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import java.math.BigDecimal;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/promo")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PromoCodeController {

    private final OrderService orderService;
    private final PromoCodeService promoCodeService;
    private final PromoCodeRepository promoCodeRepository;

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
    public ResponseEntity<?> applyPromo(@RequestParam String code, @RequestParam BigDecimal total) {
        try {
            PromoCode promo = promoCodeRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new RuntimeException("Invalid promo code"));

            if (!promo.isValidNow()) {
                throw new RuntimeException("Promo code expired or inactive");
            }

            BigDecimal discount = BigDecimal.ZERO;
            if (promo.getDiscountAmount() != null) {
                discount = promo.getDiscountAmount();
            } else if (promo.getDiscountPercent() != null) {
                discount = total.multiply(BigDecimal.valueOf(promo.getDiscountPercent())).divide(BigDecimal.valueOf(100));
            }

            BigDecimal newTotal = total.subtract(discount).max(BigDecimal.ZERO);

            return ResponseEntity.ok(Map.of("newTotal", newTotal, "discount", discount));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}