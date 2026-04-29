package uz.encode.ecommerce.Payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClickResponseDTO {
    private Long clickTransId;
    private String merchantTransId;
    private Integer merchantPrepareId;
    private Integer merchantConfirmId;
    private Integer error;
    private String errorNote;
}
