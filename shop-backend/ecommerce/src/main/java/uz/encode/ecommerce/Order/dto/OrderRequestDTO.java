package uz.encode.ecommerce.Order.dto;

import java.util.List;
import java.util.UUID;

public record OrderRequestDTO(
        UUID userId,
        List<OrderItemRequestDTO> items
) {}
