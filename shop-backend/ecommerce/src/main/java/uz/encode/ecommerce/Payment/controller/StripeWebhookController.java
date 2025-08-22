package uz.encode.ecommerce.Payment.controller;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;

import uz.encode.ecommerce.Order.entity.Order;
import uz.encode.ecommerce.Order.entity.OrderStatus;
import uz.encode.ecommerce.Order.repository.OrderRepository;
import uz.encode.ecommerce.Payment.entity.Payment;
import uz.encode.ecommerce.Payment.repository.PaymentRepository;

@RestController
@RequestMapping("/api/webhooks/stripe")
public class StripeWebhookController {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @PostMapping
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            if ("payment_intent.succeeded".equals(event.getType())) {
                PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);
                if (paymentIntent != null) {
                    String orderId = paymentIntent.getMetadata().get("orderId");
                    Order order = orderRepository.findById(UUID.fromString(orderId))
                        .orElseThrow(() -> new RuntimeException("Order not found"));

                    Payment payment = paymentRepository.findById(UUID.fromString(paymentIntent.getId()))
                        .orElseThrow(() -> new RuntimeException("Payment not found"));

                    payment.setSuccess(true);
                    payment.setStatus("PAID");
                    payment.setPaidAt(LocalDateTime.now());
                    paymentRepository.save(payment);

                    order.setStatus(OrderStatus.PAID);
                    orderRepository.save(order);
                }
            }
            return ResponseEntity.ok("Webhook processed");
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook error: " + e.getMessage());
        }
    }
}
