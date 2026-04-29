package uz.encode.ecommerce.Checkout.service;

import java.util.UUID;

import uz.encode.ecommerce.Checkout.dto.CheckoutInitResponse;
import uz.encode.ecommerce.Checkout.dto.PaymentStatusResponse;
import uz.encode.ecommerce.Order.dto.OrderRequestDTO;

public interface CheckoutService {
    CheckoutInitResponse initiateCheckout(OrderRequestDTO orderRequest);
    PaymentStatusResponse getPaymentStatus(UUID orderId);
    PaymentStatusResponse confirmPayment(UUID orderId);
}
