package uz.encode.ecommerce.Order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uz.encode.ecommerce.User.entity.User;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {
    private UUID id;
    private UUID userId;
    private User user;
    private List<OrderItemResponseDTO> items;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private String clientSecret;
}