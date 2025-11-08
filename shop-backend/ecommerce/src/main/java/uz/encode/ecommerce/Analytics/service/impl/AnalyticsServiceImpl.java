package uz.encode.ecommerce.Analytics.service.impl;

import java.time.Month;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import uz.encode.ecommerce.Analytics.dto.CategoryDistirbutionDTO;
import uz.encode.ecommerce.Analytics.dto.DashboardStatsDTO;
import uz.encode.ecommerce.Analytics.dto.MonthlyCountDTO;
import uz.encode.ecommerce.Analytics.dto.MonthlyRevenueDTO;
import uz.encode.ecommerce.Analytics.dto.OrderStatusCountDTO;
import uz.encode.ecommerce.Analytics.dto.TopProductDTO;
import uz.encode.ecommerce.Analytics.service.AnalyticsService;
import uz.encode.ecommerce.Order.repository.OrderRepository;
import uz.encode.ecommerce.Product.repository.ProductRepository;
import uz.encode.ecommerce.User.repository.UserRepository;

@Service
@AllArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    public List<MonthlyCountDTO> getProductCreationStats() {
        return IntStream.rangeClosed(1, 12)
                .mapToObj(month -> new MonthlyCountDTO(
                        Month.of(month).name(),
                        productRepository.countByMonth(month)))
                .collect(Collectors.toList());
    }

    @Override
    public List<MonthlyCountDTO> getOrderStats() {
        return IntStream.rangeClosed(1, 12)
                .mapToObj(month -> new MonthlyCountDTO(
                        Month.of(month).name(),
                        orderRepository.countByMonth(month)))
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryDistirbutionDTO> getProductCategoryStats() {
        return productRepository.countByCategory();
    }

    @Override
    public DashboardStatsDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        long totalProducts = productRepository.count();
        double totalRevenue = orderRepository.sumTotalRevenue();

        return new DashboardStatsDTO(totalUsers, totalOrders, totalProducts, totalRevenue);
    }

    @Override
    public List<OrderStatusCountDTO> getOrderStatusCounts() {
        return orderRepository.countOrdersByStatus();
    }

    @Override
    public long countUsers() {
        return userRepository.count();
    }

    @Override
    public long countOrders() {
        return orderRepository.count();
    }

    @Override
    public long countProducts() {
        return productRepository.count();
    }

    @Override
    public double sumTotalRevenue() {
        return orderRepository.sumTotalRevenue();
    }

    @Override
    public List<TopProductDTO> findTopSellingProducts(PageRequest pageRequest) {
        return productRepository.findTopSellingProducts(pageRequest);
    }

}
