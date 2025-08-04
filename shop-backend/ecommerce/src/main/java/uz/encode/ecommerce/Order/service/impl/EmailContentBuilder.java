package uz.encode.ecommerce.Order.service.impl;

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
        return templateEngine.process("email/order-confirmation", context);
    }
}

