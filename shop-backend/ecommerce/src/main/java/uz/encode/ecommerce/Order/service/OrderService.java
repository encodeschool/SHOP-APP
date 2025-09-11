package uz.encode.ecommerce.Order.service;

import java.util.List;
import java.util.UUID;

import uz.encode.ecommerce.Order.dto.OrderRequestDTO;
import uz.encode.ecommerce.Order.dto.OrderResponseDTO;

public interface OrderService {
    OrderResponseDTO createOrder(OrderRequestDTO dto);
    OrderResponseDTO getOrder(UUID orderId);
    List<OrderResponseDTO> getOrdersByUser(UUID userId);
    OrderResponseDTO updateStatus(UUID orderId, String status);
    List<OrderResponseDTO> getAllOrders(int page, int size, String status);
    String createPaymentIntent(UUID orderId, String paymentMethod);
    void deleteOrder(UUID orderId);
}
