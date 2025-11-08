package uz.encode.ecommerce.Analytics.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;

import uz.encode.ecommerce.Analytics.dto.CategoryDistirbutionDTO;
import uz.encode.ecommerce.Analytics.dto.DashboardStatsDTO;
import uz.encode.ecommerce.Analytics.dto.MonthlyCountDTO;
import uz.encode.ecommerce.Analytics.dto.MonthlyRevenueDTO;
import uz.encode.ecommerce.Analytics.dto.OrderStatusCountDTO;
import uz.encode.ecommerce.Analytics.dto.TopProductDTO;

public interface AnalyticsService {

    List<MonthlyCountDTO> getProductCreationStats();

    List<MonthlyCountDTO> getOrderStats();

    List<CategoryDistirbutionDTO> getProductCategoryStats();

    DashboardStatsDTO getDashboardStats();

    List<OrderStatusCountDTO> getOrderStatusCounts();

    long countUsers();

    long countOrders();

    long countProducts();

    double sumTotalRevenue();

    List<TopProductDTO> findTopSellingProducts(PageRequest limit);
}
