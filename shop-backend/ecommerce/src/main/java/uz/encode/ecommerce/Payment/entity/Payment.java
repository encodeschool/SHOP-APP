package uz.encode.ecommerce.Payment.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uz.encode.ecommerce.Order.entity.Order;
import uz.encode.ecommerce.Product.entity.Product;
import uz.encode.ecommerce.User.entity.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue
    private UUID id;

    private String provider; // e.g., "Stripe", "UzCard"
    private String paymentId; // e.g., Stripe session ID
    private boolean success;
    private BigDecimal amount;

    @ManyToOne
    private User user;

    @ManyToOne
    private Product product;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private String method;  // CARD, STRIPE, CASH etc.

    private String status;  // PAID, FAILED, PENDING

    private LocalDateTime paidAt;

}
