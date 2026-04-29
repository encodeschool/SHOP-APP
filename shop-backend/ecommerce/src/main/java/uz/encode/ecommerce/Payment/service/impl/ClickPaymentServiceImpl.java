package uz.encode.ecommerce.Payment.service.impl;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import uz.encode.ecommerce.Order.entity.Order;
import uz.encode.ecommerce.Order.entity.OrderStatus;
import uz.encode.ecommerce.Order.repository.OrderRepository;
import uz.encode.ecommerce.Payment.dto.ClickRequestDTO;
import uz.encode.ecommerce.Payment.dto.ClickResponseDTO;
import uz.encode.ecommerce.Payment.entity.Payment;
import uz.encode.ecommerce.Payment.repository.PaymentRepository;
import uz.encode.ecommerce.Payment.service.ClickPaymentService;

@Service
public class ClickPaymentServiceImpl implements ClickPaymentService {

    private static final String CLICK_PROVIDER = "CLICK";
    private static final String STATUS_PREPARED = "PREPARED";
    private static final String STATUS_PAID = "PAID";
    private static final String STATUS_FAILED = "FAILED";

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Value("${click.service-id}")
    private Integer serviceId;

    @Value("${click.secret-key}")
    private String secretKey;

    public ClickPaymentServiceImpl(OrderRepository orderRepository, PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public ClickResponseDTO handlePrepare(ClickRequestDTO request) {
        if (request.getAction() == null || request.getAction() != 0) {
            return errorResponse(request, -3, "Invalid action for prepare");
        }

        if (!verifySign(request, false)) {
            return errorResponse(request, -1, "Invalid signature");
        }

        if (request.getServiceId() == null || !request.getServiceId().equals(serviceId)) {
            return errorResponse(request, -2, "Invalid service_id");
        }

        Order order = loadOrder(request.getMerchantTransId());
        if (order == null) {
            return errorResponse(request, -2, "Order not found");
        }

        if (!"click".equalsIgnoreCase(order.getPaymentMethod())) {
            return errorResponse(request, -3, "Order payment method is not CLICK");
        }

        BigDecimal expectedAmount = order.getFinalPrice() != null ? order.getFinalPrice() : order.getTotalPrice();
        if (expectedAmount == null || request.getAmount() == null || expectedAmount.compareTo(request.getAmount()) != 0) {
            return errorResponse(request, -2, "Payment amount does not match order amount");
        }

        if (order.getStatus() == OrderStatus.PAID) {
            return new ClickResponseDTO(
                request.getClickTransId(),
                request.getMerchantTransId(),
                null,
                null,
                -4,
                "Order already paid"
            );
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            return errorResponse(request, -9, "Order is cancelled");
        }

        Optional<Payment> existingPayment = paymentRepository.findByOrderIdAndProviderAndStatus(order.getId(), CLICK_PROVIDER, STATUS_PREPARED);
        Payment payment = existingPayment.orElseGet(() -> {
            Payment newPayment = new Payment();
            newPayment.setProvider(CLICK_PROVIDER);
            newPayment.setOrder(order);
            newPayment.setUser(order.getUser());
            newPayment.setMethod("CLICK");
            newPayment.setAmount(expectedAmount);
            newPayment.setStatus(STATUS_PREPARED);
            newPayment.setSuccess(false);
            newPayment.setPaidAt(LocalDateTime.now());
            return newPayment;
        });

        if (payment.getClickPrepareId() == null) {
            payment.setClickPrepareId(generateRequestId());
        }
        payment.setClickTransId(request.getClickTransId());
        payment.setClickPaydocId(request.getClickPaydocId());
        payment.setMerchantUserId(request.getMerchantUserId());
        payment.setCardType(request.getCardType());
        paymentRepository.save(payment);

        return new ClickResponseDTO(
            request.getClickTransId(),
            request.getMerchantTransId(),
            payment.getClickPrepareId(),
            null,
            0,
            "Ready for payment"
        );
    }

    @Override
    public ClickResponseDTO handleComplete(ClickRequestDTO request) {
        if (request.getAction() == null || request.getAction() != 1) {
            return errorResponse(request, -3, "Invalid action for complete");
        }

        if (!verifySign(request, true)) {
            return errorResponse(request, -1, "Invalid signature");
        }

        Order order = loadOrder(request.getMerchantTransId());
        if (order == null) {
            return errorResponse(request, -2, "Order not found");
        }

        if (order.getStatus() == OrderStatus.PAID) {
            return new ClickResponseDTO(
                request.getClickTransId(),
                request.getMerchantTransId(),
                request.getMerchantPrepareId(),
                null,
                -4,
                "Order already paid"
            );
        }

        Optional<Payment> paymentOptional = paymentRepository.findByOrderIdAndClickPrepareId(order.getId(), request.getMerchantPrepareId());
        if (paymentOptional.isEmpty()) {
            return errorResponse(request, -2, "Payment record not found for prepare id");
        }

        Payment payment = paymentOptional.get();

        if (request.getError() != null && request.getError() != 0) {
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);

            payment.setStatus(STATUS_FAILED);
            payment.setSuccess(false);
            paymentRepository.save(payment);

            return new ClickResponseDTO(
                request.getClickTransId(),
                request.getMerchantTransId(),
                request.getMerchantPrepareId(),
                null,
                -9,
                "Payment canceled by click"
            );
        }

        if (payment.isSuccess()) {
            return new ClickResponseDTO(
                request.getClickTransId(),
                request.getMerchantTransId(),
                request.getMerchantPrepareId(),
                payment.getClickConfirmId(),
                -4,
                "Payment already confirmed"
            );
        }

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        payment.setStatus(STATUS_PAID);
        payment.setSuccess(true);
        payment.setClickConfirmId(generateRequestId());
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        return new ClickResponseDTO(
            request.getClickTransId(),
            request.getMerchantTransId(),
            request.getMerchantPrepareId(),
            payment.getClickConfirmId(),
            0,
            "Payment completed successfully"
        );
    }

    private boolean verifySign(ClickRequestDTO request, boolean complete) {
        if (request.getSignString() == null || request.getSignTime() == null) {
            return false;
        }

        String raw = buildSignString(request, complete);
        String actual = md5Hex(raw);
        return actual.equals(request.getSignString().toLowerCase(Locale.ROOT));
    }

    private String buildSignString(ClickRequestDTO request, boolean complete) {
        StringBuilder builder = new StringBuilder();
        builder.append(request.getClickTransId())
               .append(request.getServiceId())
               .append(secretKey)
               .append(request.getMerchantTransId());

        if (complete) {
            builder.append(request.getMerchantPrepareId());
        }

        builder.append(request.getAmount().toPlainString())
               .append(request.getAction())
               .append(request.getSignTime());

        return builder.toString();
    }

    private String md5Hex(String text) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(text.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : digest) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("MD5 algorithm not available", e);
        }
    }

    private ClickResponseDTO errorResponse(ClickRequestDTO request, int error, String errorNote) {
        return new ClickResponseDTO(
            request.getClickTransId(),
            request.getMerchantTransId(),
            null,
            null,
            error,
            errorNote
        );
    }

    private Order loadOrder(String merchantTransId) {
        if (!StringUtils.hasText(merchantTransId)) {
            return null;
        }
        try {
            UUID orderId = UUID.fromString(merchantTransId);
            return orderRepository.findById(orderId).orElse(null);
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    private int generateRequestId() {
        return (int) (Math.abs(System.currentTimeMillis() % Integer.MAX_VALUE));
    }
}
