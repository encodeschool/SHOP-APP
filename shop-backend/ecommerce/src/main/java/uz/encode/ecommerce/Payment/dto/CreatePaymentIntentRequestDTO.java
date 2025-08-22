package uz.encode.ecommerce.Payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePaymentIntentRequestDTO {
    
    private String paymentMethod;

}
