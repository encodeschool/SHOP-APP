package uz.encode.ecommerce.Analytics.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Analytics.dto.CategoryDistirbutionDTO;
import uz.encode.ecommerce.Analytics.dto.DashboardStatsDTO;
import uz.encode.ecommerce.Analytics.dto.DashboardTotalsDTO;
import uz.encode.ecommerce.Analytics.dto.MonthlyCountDTO;
import uz.encode.ecommerce.Analytics.dto.OrderStatusCountDTO;
import uz.encode.ecommerce.Analytics.dto.PaymentMethodDTO;
import uz.encode.ecommerce.Analytics.dto.TopProductDTO;
import uz.encode.ecommerce.Analytics.service.AnalyticsService;
import uz.encode.ecommerce.Payment.dto.PaymentResponseDTO;

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

    @GetMapping("/payments/monthly")
    public ResponseEntity<List<MonthlyCountDTO>> getPaymentStats() {
        return ResponseEntity.ok(analyticsService.getPaymentStats());
    }

    @GetMapping("/payments/method")
    public ResponseEntity<List<PaymentMethodDTO>> getPaymentMethodStats() {
        return ResponseEntity.ok(analyticsService.getPaymentMethodStats());
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

    @GetMapping("/payments")
    public List<PaymentResponseDTO> getAllPayments() {
        return analyticsService.getAllPayments();
    }
}
