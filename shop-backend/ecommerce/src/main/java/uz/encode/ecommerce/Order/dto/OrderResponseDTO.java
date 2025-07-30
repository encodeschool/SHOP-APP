package uz.encode.ecommerce.Order.dto;

import uz.encode.ecommerce.Order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {
    private UUID id;
    private UUID userId;
    private List<OrderItemResponseDTO> items;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private String clientSecret;
}