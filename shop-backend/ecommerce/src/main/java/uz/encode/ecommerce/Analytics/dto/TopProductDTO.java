package uz.encode.ecommerce.Analytics.dto;

import java.util.UUID;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopProductDTO {
    private UUID productId;
    private String productTitle;
    private long totalSold;
}