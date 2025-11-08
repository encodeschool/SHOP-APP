package uz.encode.ecommerce.Analytics.dto;

import lombok.*;

@Data
@NoArgsConstructor
public class MonthlyRevenueDTO {

    private String monthName;     // ← String from MONTHNAME()
    private Double totalRevenue;  // ← Double (or BigDecimal)

    // Constructor used by Hibernate
    public MonthlyRevenueDTO(String monthName, Double totalRevenue) {
        this.monthName = monthName;
        this.totalRevenue = totalRevenue;
    }
}