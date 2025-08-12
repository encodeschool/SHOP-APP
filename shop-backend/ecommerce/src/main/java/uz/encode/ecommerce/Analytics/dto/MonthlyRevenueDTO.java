package uz.encode.ecommerce.Analytics.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyRevenueDTO {
    private int month;
    private double totalRevenue;
}