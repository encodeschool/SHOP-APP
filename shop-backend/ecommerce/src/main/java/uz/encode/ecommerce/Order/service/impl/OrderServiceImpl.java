package uz.encode.ecommerce.Order.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import uz.encode.ecommerce.Order.dto.OrderItemResponseDTO;
import uz.encode.ecommerce.Order.dto.OrderRequestDTO;
import uz.encode.ecommerce.Order.dto.OrderResponseDTO;
import uz.encode.ecommerce.Order.entity.Order;
import uz.encode.ecommerce.Order.entity.OrderItem;
import uz.encode.ecommerce.Order.entity.OrderStatus;
import uz.encode.ecommerce.Order.repository.OrderItemRepository;
import uz.encode.ecommerce.Order.repository.OrderRepository;
import uz.encode.ecommerce.Order.service.OrderService;
import uz.encode.ecommerce.Product.entity.Product;
import uz.encode.ecommerce.Product.repository.ProductRepository;
import uz.encode.ecommerce.User.entity.User;
import uz.encode.ecommerce.User.repository.UserRepository;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Override
    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO dto) {
        // String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setTotalPrice(dto.getTotalPrice());
        order.setStatus(OrderStatus.PENDING);

        order.setCountry(dto.getCountry());
        order.setCity(dto.getCity());
        order.setZip(dto.getZip());
        order.setNotes(dto.getNotes());
        order.setShippingMethod(dto.getShippingMethod());
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setLegalEntity(dto.isLegalEntity());
        order.setCompanyName(dto.getCompanyName());
        order.setRegistrationNr(dto.getRegistrationNr());
        order.setVatNumber(dto.getVatNumber());
        order.setLegalAddress(dto.getLegalAddress());
        order.setAgreeToTerms(dto.isAgreeToTerms());

        List<OrderItem> items = dto.getItems().stream().map(i -> {
            Product product = productRepository.findById(i.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

            return new OrderItem(null, order, product, i.getQuantity(), i.getPricePerUnit());
        }).collect(Collectors.toList());

        order.setItems(items);
        orderRepository.save(order);

        // Send confirmation email
        emailService.sendOrderConfirmation(user.getEmail(), order);

        return mapToDTO(order);
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
