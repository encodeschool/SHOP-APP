package uz.encode.ecommerce.Payment.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

 
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClickRequestDTO {
    private Long       clickTransId;
    private Integer    serviceId;
    private Long       clickPaydocId;
    private String     merchantTransId;    // = orderId
    private Integer    merchantPrepareId;  // returned in prepare, sent back in complete
    private BigDecimal amount;
    private Integer    action;             // 0=prepare, 1=complete
    private Integer    error;              // 0=success, negative=failure (complete only)
    private String     errorNote;
    private String     signTime;
    private String     signString;
    private String     merchantUserId;
    private String     cardType;
}
