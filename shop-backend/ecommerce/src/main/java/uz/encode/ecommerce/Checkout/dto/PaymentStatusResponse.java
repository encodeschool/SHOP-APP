package uz.encode.ecommerce.Checkout.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusResponse {
    private UUID orderId;
    private String orderStatus;
    private String paymentStatus;
    private BigDecimal amount;
    private String provider;
    private String message;
}
