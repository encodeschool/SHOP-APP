package uz.encode.ecommerce.Payment.entity;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uz.encode.ecommerce.Order.entity.Order;
import uz.encode.ecommerce.Product.entity.Product;
import uz.encode.ecommerce.User.entity.User;


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

    private Long clickTransId;
    private Long clickPaydocId;
    private Integer clickPrepareId;
    private Integer clickConfirmId;
    private String merchantUserId;
    private String cardType;

    private LocalDateTime paidAt;

}
