package uz.encode.ecommerce.User.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class SubscribeEmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SubscribeEmailContentBuilder emailContentBuilder;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendSubscribtionConfirmation(String to) {
        try {
            String htmlBody = emailContentBuilder.buildConfirmation(to);
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setFrom(fromEmail);
            helper.setSubject("Subscribtion");
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

}
