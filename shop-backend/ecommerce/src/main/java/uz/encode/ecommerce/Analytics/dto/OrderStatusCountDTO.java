package uz.encode.ecommerce.Analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.encode.ecommerce.Order.entity.OrderStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusCountDTO {
    private OrderStatus status;
    private Long count;
}
