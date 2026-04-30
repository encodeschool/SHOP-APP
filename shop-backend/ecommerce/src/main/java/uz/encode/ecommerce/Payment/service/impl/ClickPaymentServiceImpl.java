package uz.encode.ecommerce.Payment.service.impl;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Order.entity.Order;
import uz.encode.ecommerce.Order.entity.OrderStatus;
import uz.encode.ecommerce.Order.repository.OrderRepository;
import uz.encode.ecommerce.Payment.dto.ClickRequestDTO;
import uz.encode.ecommerce.Payment.dto.ClickResponseDTO;
import uz.encode.ecommerce.Payment.entity.Payment;
import uz.encode.ecommerce.Payment.entity.PaymentStatus;
import uz.encode.ecommerce.Payment.repository.PaymentRepository;
import uz.encode.ecommerce.Payment.service.ClickPaymentService;

@Service
@RequiredArgsConstructor
public class ClickPaymentServiceImpl implements ClickPaymentService {

    private static final String PROVIDER = "CLICK";

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Value("${click.service-id}")
    private Integer serviceId;

    @Value("${click.secret-key}")
    private String secretKey;

    // ================= PREPARE =================
    @Transactional
    public ClickResponseDTO handlePrepare(ClickRequestDTO req) {

        String sign = buildSign(
                req.getClickTransId(),
                serviceId,
                secretKey,
                req.getMerchantTransId(),
                null,
                req.getAmount(),
                0,
                req.getSignTime()
        );

        if (!sign.equals(req.getSignString())) {
            return error(req, -1, "SIGN CHECK FAILED");
        }

        UUID orderId = UUID.fromString(req.getMerchantTransId());

        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return error(req, -5, "Order not found");
        }

        BigDecimal expected = order.getFinalPrice() != null
                ? order.getFinalPrice()
                : order.getTotalPrice();

        if (expected.subtract(req.getAmount()).abs()
                .compareTo(new BigDecimal("0.01")) > 0) {
            return error(req, -2, "Incorrect amount");
        }

        Payment payment = paymentRepository
                .findByOrder_IdAndProvider(orderId, PROVIDER)
                .orElse(new Payment());

        payment.setOrder(order);
        payment.setProvider(PROVIDER);
        payment.setAmount(req.getAmount());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setClickTransId(req.getClickTransId());
        payment.setClickPaydocId(req.getClickPaydocId());

        paymentRepository.save(payment);

        ClickResponseDTO resp = new ClickResponseDTO();
        resp.setClickTransId(req.getClickTransId());
        resp.setMerchantTransId(req.getMerchantTransId());
        resp.setMerchantPrepareId(payment.getId().toString());
        resp.setError(0);
        resp.setErrorNote("Success");

        payment.setClickPrepareId(payment.getId().toString());
        paymentRepository.save(payment);

        return resp;
    }

    // ================= COMPLETE =================
    @Transactional
    public ClickResponseDTO handleComplete(ClickRequestDTO req) {

        String sign = buildSign(
                req.getClickTransId(),
                serviceId,
                secretKey,
                req.getMerchantTransId(),
                Integer.toString(req.getMerchantPrepareId()),
                req.getAmount(),
                1,
                req.getSignTime()
        );

        if (!sign.equals(req.getSignString())) {
            return error(req, -1, "SIGN CHECK FAILED");
        }

        UUID orderId = UUID.fromString(req.getMerchantTransId());

        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return error(req, -5, "Order not found");
        }

        Payment payment = paymentRepository
                .findByClickTransId(req.getClickTransId())
                .orElse(null);

        if (payment == null) {
            return error(req, -6, "Prepare not found");
        }

        // already paid
        if (payment.getStatus() == PaymentStatus.PAID) {
            ClickResponseDTO resp = new ClickResponseDTO();
            resp.setClickTransId(req.getClickTransId());
            resp.setMerchantTransId(req.getMerchantTransId());
            resp.setMerchantConfirmId(payment.getId().toString());
            resp.setError(0);
            resp.setErrorNote("Already done");
            return resp;
        }

        // FAILED
        if (req.getError() != null && req.getError() < 0) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);

            order.setStatus(OrderStatus.PAYMENT_FAILED);
            orderRepository.save(order);

            return success(req, "Failure recorded");
        }

        // SUCCESS
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        ClickResponseDTO resp = new ClickResponseDTO();
        resp.setClickTransId(req.getClickTransId());
        resp.setMerchantTransId(req.getMerchantTransId());
        resp.setMerchantConfirmId(payment.getId().toString());
        resp.setError(0);
        resp.setErrorNote("Success");

        return resp;
    }

    // ================= SIGNATURE =================
    private String buildSign(
            Long clickTransId,
            Integer serviceId,
            String secret,
            String merchantTransId,
            String merchantPrepareId,
            BigDecimal amount,
            int action,
            String signTime
    ) {
        try {
            String raw = clickTransId +
                    serviceId +
                    secret +
                    merchantTransId +
                    (merchantPrepareId != null ? merchantPrepareId : "") +
                    amount.toPlainString() +
                    action +
                    signTime;

            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(raw.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // ================= HELPERS =================
    private ClickResponseDTO error(ClickRequestDTO req, int code, String note) {
        ClickResponseDTO r = new ClickResponseDTO();
        r.setClickTransId(req.getClickTransId());
        r.setMerchantTransId(req.getMerchantTransId());
        r.setError(code);
        r.setErrorNote(note);
        return r;
    }

    private ClickResponseDTO success(ClickRequestDTO req, String note) {
        ClickResponseDTO r = new ClickResponseDTO();
        r.setClickTransId(req.getClickTransId());
        r.setMerchantTransId(req.getMerchantTransId());
        r.setError(0);
        r.setErrorNote(note);
        return r;
    }
}