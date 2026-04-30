package uz.encode.ecommerce.Payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ClickResponseDTO {

    @JsonProperty("click_trans_id")
    private Long clickTransId;

    @JsonProperty("merchant_trans_id")
    private String merchantTransId;

    @JsonProperty("merchant_prepare_id")
    private String merchantPrepareId;

    @JsonProperty("merchant_confirm_id")
    private String merchantConfirmId;

    @JsonProperty("error")
    private Integer error;

    @JsonProperty("error_note")
    private String errorNote;
}