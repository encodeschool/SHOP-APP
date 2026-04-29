package uz.encode.ecommerce.Payment.controller;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Payment.dto.ClickRequestDTO;
import uz.encode.ecommerce.Payment.dto.ClickResponseDTO;
import uz.encode.ecommerce.Payment.service.ClickPaymentService;

@RestController
@RequestMapping("/api/click")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClickPaymentController {

    private final ClickPaymentService clickPaymentService;

    @PostMapping(value = "/prepare", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<ClickResponseDTO> prepare(@RequestParam Map<String, String> params) {
        ClickRequestDTO request = mapRequest(params);
        return ResponseEntity.ok(clickPaymentService.handlePrepare(request));
    }

    @PostMapping(value = "/complete", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<ClickResponseDTO> complete(@RequestParam Map<String, String> params) {
        ClickRequestDTO request = mapRequest(params);
        return ResponseEntity.ok(clickPaymentService.handleComplete(request));
    }

    private ClickRequestDTO mapRequest(Map<String, String> params) {
        return new ClickRequestDTO(
            parseLong(params.get("click_trans_id")),
            parseInteger(params.get("service_id")),
            parseLong(params.get("click_paydoc_id")),
            params.get("merchant_trans_id"),
            parseInteger(params.get("merchant_prepare_id")),
            parseBigDecimal(params.get("amount")),
            parseInteger(params.get("action")),
            parseInteger(params.get("error")),
            params.get("error_note"),
            params.get("sign_time"),
            params.get("sign_string"),
            params.get("merchant_user_id"),
            params.get("card_type")
        );
    }

    private Long parseLong(String value) {
        if (value == null) {
            return null;
        }
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private Integer parseInteger(String value) {
        if (value == null) {
            return null;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private BigDecimal parseBigDecimal(String value) {
        try {
            return value == null ? null : new BigDecimal(value);
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
