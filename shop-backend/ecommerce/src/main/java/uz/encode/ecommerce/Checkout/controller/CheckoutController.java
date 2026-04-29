package uz.encode.ecommerce.Checkout.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import uz.encode.ecommerce.Checkout.dto.CheckoutInitResponse;
import uz.encode.ecommerce.Checkout.dto.PaymentStatusResponse;
import uz.encode.ecommerce.Checkout.service.CheckoutService;
import uz.encode.ecommerce.Order.dto.OrderRequestDTO;

@RestController
@RequestMapping("/api/checkout")
@Tag(name = "Checkout API", description = "Checkout and Payment Flow Management")
@CrossOrigin(origins = "*")
public class CheckoutController {

    @Autowired
    private CheckoutService checkoutService;

    @Operation(summary = "Initiate Checkout - Create Order and Get Payment Details")
    @PostMapping("/initiate")
    public ResponseEntity<CheckoutInitResponse> initiateCheckout(@RequestBody OrderRequestDTO orderRequest) {
        CheckoutInitResponse response = checkoutService.initiateCheckout(orderRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get Payment Status for Order")
    @GetMapping("/payment-status/{orderId}")
    public ResponseEntity<PaymentStatusResponse> getPaymentStatus(@PathVariable UUID orderId) {
        PaymentStatusResponse response = checkoutService.getPaymentStatus(orderId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Confirm Payment After CLICK Redirect")
    @PostMapping("/confirm/{orderId}")
    public ResponseEntity<PaymentStatusResponse> confirmPayment(@PathVariable UUID orderId) {
        PaymentStatusResponse response = checkoutService.confirmPayment(orderId);
        return ResponseEntity.ok(response);
    }
}
