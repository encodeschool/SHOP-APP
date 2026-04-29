package uz.encode.ecommerce.Checkout.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutInitResponse {
    private UUID orderId;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String paymentUrl;
    private String clientSecret;
    private String status;
    private String message;
}
