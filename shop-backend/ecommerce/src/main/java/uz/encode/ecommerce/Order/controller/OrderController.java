package uz.encode.ecommerce.Order.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.encode.ecommerce.Order.dto.*;
import uz.encode.ecommerce.Order.service.OrderService;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Order API", description = "Order API Management")
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "Save Order")
    @PreAuthorize("hasRole('BUYER')")
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderRequestDTO dto) {
        return new ResponseEntity<>(orderService.createOrder(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Get Order")
    @PreAuthorize("hasRole('ADMIN') or @orderSecurity.isOrderOwner(#orderId, authentication.name)")
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrder(@PathVariable UUID orderId) {
        return ResponseEntity.ok(orderService.getOrder(orderId));
    }

    @Operation(summary = "Get Orders By User")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @Operation(summary = "Get All Orders")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SELLER')")
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size, status));
    }

    @Operation(summary = "Update Order Status")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable UUID orderId,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(orderService.updateStatus(orderId, status));
    }
}
