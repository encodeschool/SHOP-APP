package uz.encode.ecommerce.Order.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemResponseDTO(
        UUID productId,
        String productTitle,
        int quantity,
        BigDecimal pricePerUnit
) {}
