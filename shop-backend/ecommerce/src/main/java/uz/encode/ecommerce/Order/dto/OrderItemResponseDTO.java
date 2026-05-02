package uz.encode.ecommerce.Order.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record OrderItemResponseDTO(
        UUID productId,
        String productTitle,
        int quantity,
        BigDecimal pricePerUnit,
        List<String> productImages
) {}
