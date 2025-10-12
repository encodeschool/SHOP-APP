package uz.encode.ecommerce.Order.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "promo_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    private BigDecimal discountAmount; // e.g., $10 off
    private Integer discountPercent; // or e.g., 15%

    private LocalDateTime validFrom;
    private LocalDateTime validUntil;

    private boolean active = true;
    private int usageLimit = 100; // optional
    private int timesUsed = 0;

    public boolean isValidNow() {
        LocalDateTime now = LocalDateTime.now();
        return active &&
                (validFrom == null || now.isAfter(validFrom)) &&
                (validUntil == null || now.isBefore(validUntil)) &&
                (timesUsed < usageLimit);
    }
}
