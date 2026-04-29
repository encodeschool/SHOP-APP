package uz.encode.ecommerce.Payment.service;

import uz.encode.ecommerce.Payment.dto.ClickRequestDTO;
import uz.encode.ecommerce.Payment.dto.ClickResponseDTO;

public interface ClickPaymentService {
    ClickResponseDTO handlePrepare(ClickRequestDTO request);
    ClickResponseDTO handleComplete(ClickRequestDTO request);
}
