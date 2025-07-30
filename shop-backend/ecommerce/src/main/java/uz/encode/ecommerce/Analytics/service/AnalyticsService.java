package uz.encode.ecommerce.Analytics.service;

import java.util.List;

import uz.encode.ecommerce.Analytics.dto.CategoryDistirbutionDTO;
import uz.encode.ecommerce.Analytics.dto.MonthlyCountDTO;

public interface AnalyticsService {
    
    List<MonthlyCountDTO> getProductCreationStats();

    List<MonthlyCountDTO> getOrderStats();

    List<CategoryDistirbutionDTO> getProductCategoryStats();

}
