package uz.encode.ecommerce.Order.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import uz.encode.ecommerce.Order.dto.*;
import uz.encode.ecommerce.Order.entity.*;
import uz.encode.ecommerce.Order.repository.*;
import uz.encode.ecommerce.Order.service.OrderService;
import uz.encode.ecommerce.Product.entity.Product;
import uz.encode.ecommerce.Product.repository.ProductRepository;
import uz.encode.ecommerce.User.entity.User;
import uz.encode.ecommerce.User.repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Override
    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO dto) {
        Stripe.apiKey = stripeSecretKey;
        
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequestDTO itemDTO : dto.items()) {
            Product product = productRepository.findById(itemDTO.productId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getQuantity() < itemDTO.quantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getTitle());
            }

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setOrder(order);
            item.setQuantity(itemDTO.quantity());
            item.setPricePerUnit(product.getPrice());

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemDTO.quantity())));
            items.add(item);

            product.setQuantity(product.getQuantity() - itemDTO.quantity()); // Update stock
        }

        order.setItems(items);
        order.setTotalPrice(total);

        // Create Stripe PaymentIntent
        String clientSecret;
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(
                    PaymentIntentCreateParams.builder()
                            .setAmount(order.getTotalPrice().multiply(BigDecimal.valueOf(100)).longValue())
                            .setCurrency("usd")
                            .setAutomaticPaymentMethods(
                                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                            .setEnabled(true)
                                            .build()
                            )
                            .build()
            );
            clientSecret = paymentIntent.getClientSecret();
        } catch (StripeException e) {
            throw new RuntimeException("Failed to create PaymentIntent: " + e.getMessage());
        }

        orderRepository.save(order);
        productRepository.saveAll(
                items.stream().map(OrderItem::getProduct).toList()
        );

        OrderResponseDTO response = mapToDTO(order);
        response.setClientSecret(clientSecret);
        return response;
    }

    @Override
    public OrderResponseDTO getOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToDTO(order);
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUser(UUID userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public OrderResponseDTO updateStatus(UUID orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status");
        }

        orderRepository.save(order);
        return mapToDTO(order);
    }

    @Override
    public List<OrderResponseDTO> getAllOrders(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage;

        if (status != null && !status.isBlank()) {
            try {
                OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
                orderPage = orderRepository.findAllByStatus(orderStatus, pageable);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status filter");
            }
        } else {
            orderPage = orderRepository.findAll(pageable);
        }

        return orderPage.getContent().stream()
                .map(this::mapToDTO)
                .toList();
    }

    private OrderResponseDTO mapToDTO(Order order) {
        List<OrderItemResponseDTO> itemDTOs = order.getItems().stream()
                .map(item -> new OrderItemResponseDTO(
                        item.getProduct().getId(),
                        item.getProduct().getTitle(),
                        item.getQuantity(),
                        item.getPricePerUnit()
                )).toList();

        return new OrderResponseDTO(
            order.getId(),
            order.getUser().getId(),
            itemDTOs,
            order.getTotalPrice(),
            order.getStatus().name(),
            order.getCreatedAt(),
            order.getClientSecret()
        );
    }
}
