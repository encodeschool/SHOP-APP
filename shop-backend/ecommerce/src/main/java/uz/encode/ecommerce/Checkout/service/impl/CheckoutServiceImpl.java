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
import uz.encode.ecommerce.Payment.entity.PaymentStatus;
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

        OrderResponseDTO order = orderService.createOrder(orderRequest);

        UUID orderId = order.getId();
        BigDecimal amount = order.getFinalPrice() != null
                ? order.getFinalPrice()
                : order.getTotalPrice();

        CheckoutInitResponse response = new CheckoutInitResponse();
        response.setOrderId(orderId);
        response.setTotalAmount(amount);
        response.setPaymentMethod(order.getPaymentMethod());
        response.setStatus("INITIATED");

        if ("click".equalsIgnoreCase(order.getPaymentMethod())) {
            response.setPaymentUrl(buildClickPaymentUrl(orderId, amount));
            response.setMessage("Click payment URL ready");
        }

        return response;
    }

    @Override
    public PaymentStatusResponse getPaymentStatus(UUID orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        PaymentStatusResponse response = new PaymentStatusResponse();
        response.setOrderId(orderId);
        response.setOrderStatus(order.getStatus().name());
        response.setAmount(order.getFinalPrice() != null
                ? order.getFinalPrice()
                : order.getTotalPrice());

        Optional<Payment> payment = paymentRepository
                .findByOrder_IdAndProvider(orderId, "CLICK");

        if (payment.isPresent()) {
            Payment p = payment.get();

            response.setPaymentStatus(p.getStatus().name());
            response.setProvider(p.getProvider());

            if (PaymentStatus.PAID.equals(p.getStatus())) {
                response.setMessage("Payment confirmed");
            } else if (PaymentStatus.FAILED.equals(p.getStatus())) {
                response.setMessage("Payment failed");
            } else {
                response.setMessage("Payment pending");
            }

        } else {
            response.setPaymentStatus("PENDING");
            response.setProvider("CLICK");
            response.setMessage("Awaiting payment");
        }

        return response;
    }

    @Override
    public PaymentStatusResponse confirmPayment(UUID orderId) {
        return getPaymentStatus(orderId);
    }

    private String buildClickPaymentUrl(UUID orderId, BigDecimal amount) {

        String returnUrl = frontendUrl + "/order-confirmation?orderId=" + orderId;

        return String.format(
                "https://my.click.uz/services/pay?merchant_id=%d&service_id=%d" +
                        "&transaction_param=%s&amount=%s&return_url=%s",
                clickMerchantId,
                clickServiceId,
                orderId.toString(),
                amount.toPlainString(),
                URLEncoder.encode(returnUrl, StandardCharsets.UTF_8)
        );
    }
}