package uz.encode.ecommerce.Analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyCountDTO {
    
    private String month;
    private long count;

}
