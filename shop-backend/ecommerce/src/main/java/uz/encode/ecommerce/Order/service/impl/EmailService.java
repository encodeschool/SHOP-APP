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

    // Inject your Gmail username from application.properties
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOrderConfirmation(String to, Order order) {
        try {
            String htmlBody = emailContentBuilder.buildOrderConfirmationEmail(order);
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);          // Set sender email here
            helper.setTo(to);
            helper.setSubject("Order Confirmation");
            helper.setText(htmlBody, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
