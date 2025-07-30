package uz.encode.ecommerce.Analytics.service.impl;

import java.time.Month;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import uz.encode.ecommerce.Analytics.dto.CategoryDistirbutionDTO;
import uz.encode.ecommerce.Analytics.dto.MonthlyCountDTO;
import uz.encode.ecommerce.Analytics.service.AnalyticsService;
import uz.encode.ecommerce.Order.repository.OrderRepository;
import uz.encode.ecommerce.Product.repository.ProductRepository;

@Service
@AllArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Override
    public List<MonthlyCountDTO> getProductCreationStats() {
        return IntStream.rangeClosed(1, 12)
                        .mapToObj(month -> new MonthlyCountDTO(
                            Month.of(month).name(),
                            productRepository.countByMonth(month)                            
                        ))
                        .collect(Collectors.toList());
    }

    @Override
    public List<MonthlyCountDTO> getOrderStats() {
        return IntStream.rangeClosed(1, 12)
                        .mapToObj(month -> new MonthlyCountDTO(
                            Month.of(month).name(),
                            orderRepository.countByMonth(month)    
                        ))
                        .collect(Collectors.toList());
    }

    @Override
    public List<CategoryDistirbutionDTO> getProductCategoryStats() {
        return productRepository.countByCategory();
    }
    
}
