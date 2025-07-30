package uz.encode.ecommerce.Order.dto;

import java.util.UUID;

public record OrderItemRequestDTO(
        UUID productId,
        int quantity
) {}