package uz.encode.ecommerce.User.config;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uz.encode.ecommerce.Order.repository.OrderRepository;

import java.util.UUID;

@Component("orderSecurity")
@RequiredArgsConstructor
public class OrderSecurity {

    private final OrderRepository orderRepository;

    public boolean isOrderOwner(UUID orderId, String username) {
        return orderRepository.findById(orderId)
                .map(order -> order.getUser().getEmail().equals(username))
                .orElse(false);
    }
}