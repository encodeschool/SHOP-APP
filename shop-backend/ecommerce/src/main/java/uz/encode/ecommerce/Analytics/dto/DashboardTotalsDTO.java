package uz.encode.ecommerce.Analytics.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardTotalsDTO {
    private long totalUsers;
    private long totalOrders;
    private long totalProducts;
    private double totalRevenue;
}