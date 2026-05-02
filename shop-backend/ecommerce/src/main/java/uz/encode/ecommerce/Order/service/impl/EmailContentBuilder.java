package uz.encode.ecommerce.Order.service.impl;

import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import uz.encode.ecommerce.Order.entity.Order;

@Service
public class EmailContentBuilder {

    @Autowired
    private TemplateEngine templateEngine;

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    // =========================
    // COMMON CONTEXT BUILDER
    // =========================
    private Context buildBaseContext(Order order) {
        Context context = new Context();

        String formattedDate = order.getCreatedAt() != null
                ? order.getCreatedAt().format(FORMATTER)
                : "N/A";

        String formattedTotal = order.getTotalPrice() != null
                ? String.format("%.2f", order.getTotalPrice())
                : "0.00";

        context.setVariable("order", order);
        context.setVariable("formattedDate", formattedDate);
        context.setVariable("formattedTotal", formattedTotal);
        context.setVariable("shippingMethod", order.getShippingMethod());

        return context;
    }

    // =========================
    // ORDER EMAILS
    // =========================

    public String buildOrderConfirmationEmail(Order order) {
        Context context = buildBaseContext(order);
        return templateEngine.process("email/order-confirmation", context);
    }

    public String buildOrderRequest(Order order) {
        Context context = buildBaseContext(order);
        return templateEngine.process("email/order-request", context);
    }

    // =========================
    // PAYMENT EMAILS
    // =========================

    public String buildClickPaymentEmail(Order order) {
        Context context = buildBaseContext(order);
        return templateEngine.process("email/paymentMethods/payment-click", context);
    }

    public String buildCashPaymentEmail(Order order) {
        Context context = buildBaseContext(order);
        return templateEngine.process("email/paymentMethods/payment-cash", context);
    }

    public String buildStripePaymentEmail(Order order) {
        Context context = buildBaseContext(order);
        return templateEngine.process("email/paymentMethods/payment-stripe", context);
    }

    public String buildPaymentSuccessEmail(Order order) {
        Context context = buildBaseContext(order);
        return templateEngine.process("email/paymentMethods/payment-success", context);
    }
}