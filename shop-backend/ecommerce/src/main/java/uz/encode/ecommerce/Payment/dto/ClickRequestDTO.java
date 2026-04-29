package uz.encode.ecommerce.Payment.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClickRequestDTO {
    private Long clickTransId;
    private Integer serviceId;
    private Long clickPaydocId;
    private String merchantTransId;
    private Integer merchantPrepareId;
    private BigDecimal amount;
    private Integer action;
    private Integer error;
    private String errorNote;
    private String signTime;
    private String signString;
    private String merchantUserId;
    private String cardType;
}
