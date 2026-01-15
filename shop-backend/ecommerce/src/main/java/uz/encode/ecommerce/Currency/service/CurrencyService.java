package uz.encode.ecommerce.Currency.service;

import java.util.List;
import java.util.UUID;

import uz.encode.ecommerce.Currency.dto.CurrencyDTO;
import uz.encode.ecommerce.Currency.entity.Currency;

public interface CurrencyService {
    
    List<Currency> getAll();

    Currency getById(Long id);

    Currency getByCode(String code);

    Currency create(CurrencyDTO dto);

    Currency update(Long id, CurrencyDTO dto);

    void delete(Long id);

}
