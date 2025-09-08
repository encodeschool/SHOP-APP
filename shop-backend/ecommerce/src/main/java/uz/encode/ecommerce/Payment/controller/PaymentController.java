package uz.encode.ecommerce.Payment.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.encode.ecommerce.Order.service.OrderService;

import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final OrderService orderService;

    @PostMapping("/create-intent/{orderId}")
    public ResponseEntity<String> createPaymentIntent(
            @PathVariable UUID orderId,
            @RequestParam(defaultValue = "card") String method
    ) {
        String clientSecret = orderService.createPaymentIntent(orderId, method);
        return ResponseEntity.ok(clientSecret);
    }
}
