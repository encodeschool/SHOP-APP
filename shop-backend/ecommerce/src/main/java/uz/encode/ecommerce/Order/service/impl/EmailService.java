// package uz.encode.ecommerce.Order.service.impl;

// import org.springframework.stereotype.Service;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class EmailService {

//     private final JavaMailSender mailSender;

//     public void sendOrderConfirmation(String to, Order order) {
//         SimpleMailMessage message = new SimpleMailMessage();
//         message.setTo(to);
//         message.setSubject("Order Confirmation");
//         message.setText("Thank you for your order!\nOrder ID: " + order.getId() +
//             "\nTotal: $" + order.getTotalPrice());

//         mailSender.send(message);
//     }
// }
