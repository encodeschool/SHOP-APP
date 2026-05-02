package uz.encode.ecommerce.Payment.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponseDTO {
    private UUID id;
    private UUID orderId;
    private String userName;
    private String userEmail;
    private String method;
    private BigDecimal amount;
    private String status;
    private LocalDateTime paidAt;
    private String cardType;
    private String provider;
    private Long clickTransId;
}
