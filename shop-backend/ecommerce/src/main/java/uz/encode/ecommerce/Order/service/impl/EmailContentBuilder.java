package uz.encode.ecommerce.Order.service.impl;

import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import uz.encode.ecommerce.Order.entity.Order;

@Service
public class EmailContentBuilder {

    @Autowired
    private TemplateEngine templateEngine;

    public EmailContentBuilder(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public String buildOrderConfirmationEmail(Order order) {
        Context context = new Context();
        context.setVariable("order", order);
        // Pre-format the date and total
        String formattedDate = order.getCreatedAt()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        String formattedTotal = String.format("%.2f", order.getTotalPrice());

        context.setVariable("order", order);
        context.setVariable("formattedDate", formattedDate);
        context.setVariable("formattedTotal", formattedTotal);
        context.setVariable("shippingMethod", order.getShippingMethod());

        return templateEngine.process("email/order-confirmation", context);
    }
}

