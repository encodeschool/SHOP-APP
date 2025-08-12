package uz.encode.ecommerce.Analytics.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import uz.encode.ecommerce.Analytics.dto.CategoryDistirbutionDTO;
import uz.encode.ecommerce.Analytics.dto.DashboardStatsDTO;
import uz.encode.ecommerce.Analytics.dto.DashboardTotalsDTO;
import uz.encode.ecommerce.Analytics.dto.MonthlyCountDTO;
import uz.encode.ecommerce.Analytics.dto.MonthlyRevenueDTO;
import uz.encode.ecommerce.Analytics.dto.OrderStatusCountDTO;
import uz.encode.ecommerce.Analytics.dto.TopProductDTO;
import uz.encode.ecommerce.Analytics.service.AnalyticsService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/products/monthly")
    public ResponseEntity<List<MonthlyCountDTO>> getProductStats() {
        return ResponseEntity.ok(analyticsService.getProductCreationStats());
    }

    @GetMapping("/orders/monthly")
    public ResponseEntity<List<MonthlyCountDTO>> getOrderStats() {
        return ResponseEntity.ok(analyticsService.getOrderStats());
    }

    @GetMapping("/products/category")
    public ResponseEntity<List<CategoryDistirbutionDTO>> getCategoryStats() {
        return ResponseEntity.ok(analyticsService.getProductCategoryStats());
    }

    @GetMapping("/stats")
    public DashboardStatsDTO getDashboardStats() {
        return analyticsService.getDashboardStats();
    }

    @GetMapping("/orders/status")
    public List<OrderStatusCountDTO> getOrderStatusCounts() {
        return analyticsService.getOrderStatusCounts();
    }

    // Users registered per month
    // @GetMapping("/users/monthly")
    // public List<MonthlyCountDTO> getUserStats() {
    // return analyticsService.countUsersGroupedByMonth();
    // }

    // Total revenue per month
    // @GetMapping("/revenue/monthly")
    // public List<MonthlyRevenueDTO> getRevenueStats() {
    // return analyticsService.sumRevenueGroupedByMonth();
    // }

    // Top selling products
    @GetMapping("/products/top")
    public List<TopProductDTO> getTopProducts() {
        return analyticsService.findTopSellingProducts(PageRequest.of(0, 5));
    }

    // Totals for dashboard
    @GetMapping("/totals")
    public DashboardTotalsDTO getTotals() {
        long totalUsers = analyticsService.countUsers();
        long totalOrders = analyticsService.countOrders();
        long totalProducts = analyticsService.countProducts();
        double totalRevenue = analyticsService.sumTotalRevenue();

        return new DashboardTotalsDTO(totalUsers, totalOrders, totalProducts, totalRevenue);
    }
}
