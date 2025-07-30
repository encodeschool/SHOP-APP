package uz.encode.ecommerce.Analytics.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import uz.encode.ecommerce.Analytics.dto.CategoryDistirbutionDTO;
import uz.encode.ecommerce.Analytics.dto.MonthlyCountDTO;
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
}
