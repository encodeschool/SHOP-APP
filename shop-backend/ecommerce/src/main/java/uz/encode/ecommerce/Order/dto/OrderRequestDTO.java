package uz.encode.ecommerce.Order.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class OrderRequestDTO {
    private UUID userId;
    private String name;
    private String email;
    private String phone;

    private boolean isLegalEntity;
    private String companyName;
    private String registrationNr;
    private String vatNumber;
    private String legalAddress;

    private String country;
    private String zip;
    private String city;
    private String notes;

    private String shippingMethod;
    private String paymentMethod;
    private boolean agreeToTerms;

    private List<OrderItemDTO> items;
    private BigDecimal totalPrice;
    private String promoCode;
}