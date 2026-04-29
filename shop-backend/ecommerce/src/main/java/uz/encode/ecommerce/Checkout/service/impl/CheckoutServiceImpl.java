package uz.encode.ecommerce.Checkout.service.impl;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import uz.encode.ecommerce.Checkout.dto.CheckoutInitResponse;
import uz.encode.ecommerce.Checkout.dto.PaymentStatusResponse;
import uz.encode.ecommerce.Checkout.service.CheckoutService;
import uz.encode.ecommerce.Order.dto.OrderRequestDTO;
import uz.encode.ecommerce.Order.dto.OrderResponseDTO;
import uz.encode.ecommerce.Order.entity.Order;
import uz.encode.ecommerce.Order.repository.OrderRepository;
import uz.encode.ecommerce.Order.service.OrderService;
import uz.encode.ecommerce.Payment.entity.Payment;
import uz.encode.ecommerce.Payment.repository.PaymentRepository;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Value("${click.merchant-id}")
    private Integer clickMerchantId;

    @Value("${click.service-id}")
    private Integer clickServiceId;

    @Value("${app.frontend-url:http://localhost:3003}")
    private String frontendUrl;

    @Override
    public CheckoutInitResponse initiateCheckout(OrderRequestDTO orderRequest) {
        try {
            OrderResponseDTO order = orderService.createOrder(orderRequest);
            UUID orderId = order.getId();
            BigDecimal totalAmount = order.getTotalPrice();
            String paymentMethod = order.getPaymentMethod();

            CheckoutInitResponse response = new CheckoutInitResponse();
            response.setOrderId(orderId);
            response.setTotalAmount(totalAmount);
            response.setPaymentMethod(paymentMethod);
            response.setStatus("INITIATED");

            if ("click".equalsIgnoreCase(paymentMethod)) {
                response.setPaymentUrl(buildClickPaymentUrl(orderId, totalAmount));
                response.setMessage("Click payment URL ready");
            } else if ("card".equalsIgnoreCase(paymentMethod)) {
                String clientSecret = orderService.createPaymentIntent(orderId, "card");
                response.setClientSecret(clientSecret);
                response.setMessage("Stripe payment intent created");
            } else if ("cod".equalsIgnoreCase(paymentMethod)) {
                response.setMessage("Cash on Delivery - Order awaiting confirmation");
            }

            return response;
        } catch (Exception e) {
            throw new RuntimeException("Checkout initiation failed: " + e.getMessage());
        }
    }

    @Override
    public PaymentStatusResponse getPaymentStatus(UUID orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        Optional<Payment> payment = paymentRepository.findByOrderIdAndProviderAndStatus(
            orderId, "CLICK", "PAID"
        );

        PaymentStatusResponse response = new PaymentStatusResponse();
        response.setOrderId(orderId);
        response.setOrderStatus(order.getStatus().name());
        response.setAmount(order.getFinalPrice() != null ? order.getFinalPrice() : order.getTotalPrice());

        if (payment.isPresent()) {
            Payment p = payment.get();
            response.setPaymentStatus(p.getStatus());
            response.setProvider(p.getProvider());
            response.setMessage("Payment confirmed");
        } else {
            response.setPaymentStatus("PENDING");
            response.setMessage("Payment still pending");
        }

        return response;
    }

    @Override
    public PaymentStatusResponse confirmPayment(UUID orderId) {
        return getPaymentStatus(orderId);
    }

    private String buildClickPaymentUrl(UUID orderId, BigDecimal amount) {
        String returnUrl = frontendUrl + "/order-confirmation?orderId=" + orderId;
        String amountStr = amount.toPlainString();

        return String.format(
            "https://my.click.uz/services/pay?merchant_id=%d&service_id=%d&transaction_param=%s&amount=%s&return_url=%s&card_type=uzcard",
            clickMerchantId,
            clickServiceId,
            orderId.toString(),
            amountStr,
            URLEncoder.encode(returnUrl, StandardCharsets.UTF_8)
        );
    }
}
