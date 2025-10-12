package uz.encode.ecommerce.Order.controller;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Order.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/promo")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PromoCodeController {

    private final OrderService orderService;

    @PostMapping("/apply")
    public ResponseEntity<Map<String, Object>> applyPromo(
            @RequestParam String code,
            @RequestParam BigDecimal total
    ) {
        BigDecimal newTotal = orderService.applyPromo(code, total);
        return ResponseEntity.ok(Map.of("newTotal", newTotal));
    }
}