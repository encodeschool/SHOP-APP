package uz.encode.ecommerce.User.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class SubscribeEmailContentBuilder {
    
    @Autowired
    private TemplateEngine templateEngine;

    public String buildConfirmation(String email) {
        Context context = new Context();
        context.setVariable("email", email);
        return templateEngine.process("email/subscribtion-confirmation", context);
    }

}
