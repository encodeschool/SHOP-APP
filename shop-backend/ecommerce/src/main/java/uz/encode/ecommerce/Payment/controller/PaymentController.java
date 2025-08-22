package uz.encode.ecommerce.Payment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import uz.encode.ecommerce.Payment.service.PaymentService;

@Controller
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;

}
