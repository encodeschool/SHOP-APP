package uz.encode.ecommerce.Order.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCodeDTO {
    private Long id;
    private String code;
    private BigDecimal discountAmount;
    private Integer discountPercent;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private boolean active;
    private int usageLimit;
    private int timesUsed;
}
