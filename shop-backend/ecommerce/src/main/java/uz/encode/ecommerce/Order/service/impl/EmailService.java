package uz.encode.ecommerce.Order.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import uz.encode.ecommerce.Order.entity.Order;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailContentBuilder emailContentBuilder;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // =========================
    // ORDER EMAILS
    // =========================

    public void sendOrderConfirmation(String to, Order order) {
        sendEmail(to, "Order Confirmation",
                emailContentBuilder.buildOrderConfirmationEmail(order));
    }

    public void sendOrderRequest(Order order) {
        sendEmail(fromEmail, "Request Order",
                emailContentBuilder.buildOrderRequest(order));
    }

    // =========================
    // PAYMENT EMAILS
    // =========================

    public void sendClickPaymentInstructions(String to, Order order) {
        sendEmail(to,
                "Complete your payment via CLICK",
                emailContentBuilder.buildClickPaymentEmail(order));
    }

    public void sendCashOnDeliveryEmail(String to, Order order) {
        sendEmail(to,
                "Cash on Delivery Order Placed",
                emailContentBuilder.buildCashPaymentEmail(order));
    }

    public void sendStripePaymentEmail(String to, Order order) {
        sendEmail(to,
                "Complete your card payment",
                emailContentBuilder.buildStripePaymentEmail(order));
    }

    public void sendPaymentSuccessEmail(String to, Order order) {
        sendEmail(to,
                "Payment Successful",
                emailContentBuilder.buildPaymentSuccessEmail(order));
    }

    // =========================
    // BASE METHOD
    // =========================

    private void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Email sending failed: " + e.getMessage());
        }
    }
}