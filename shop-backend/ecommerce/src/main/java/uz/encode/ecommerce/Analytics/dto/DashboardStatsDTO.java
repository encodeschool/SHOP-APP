package uz.encode.ecommerce.Analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalOrders;
    private long totalProducts;
    private double totalRevenue;
}