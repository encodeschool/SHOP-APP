package uz.encode.ecommerce.Currency.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import uz.encode.ecommerce.Currency.dto.CurrencyDTO;
import uz.encode.ecommerce.Currency.entity.Currency;
import uz.encode.ecommerce.Currency.exception.CurrencyNotFoundException;
import uz.encode.ecommerce.Currency.exception.DuplicateCurrencyException;
import uz.encode.ecommerce.Currency.repository.CurrencyRepository;
import uz.encode.ecommerce.Currency.service.CurrencyService;

@Service
@AllArgsConstructor
public class CurrencyServiceImpl implements CurrencyService {

    private final CurrencyRepository currencyRepository;

    @Override
    public List<Currency> getAll() {
        return currencyRepository.findAll();
    }

    @Override
    public Currency getById(Long id) {
        return currencyRepository.findById(id).orElseThrow(() -> new CurrencyNotFoundException("Currency not found with ID: " + id));
    }

    @Override
    public Currency getByCode(String code) {
        return currencyRepository.findByCode(code).orElseThrow(() -> new CurrencyNotFoundException("Currency not found with code: " + code));
    }

    @Override
    public Currency create(CurrencyDTO dto) {
        if (currencyRepository.existsByCode(dto.getCode())) {
            throw new DuplicateCurrencyException("Currency already exists " + dto.getCode());
        }

        Currency  currency = new Currency(
            null,
            dto.getCode(),
            dto.getName(),
            dto.getSymbol(),
            dto.isActive()
        );

        return currencyRepository.save(currency);
    }

    @Override
    public Currency update(Long id, CurrencyDTO dto) {
        Currency currency = getById(id);

        currency.setName(dto.getName());
        currency.setCode(dto.getCode());
        currency.setSymbol(dto.getSymbol());
        currency.setActive(dto.isActive());

        return currencyRepository.save(currency);
    }

    @Override
    public void delete(Long id) {
        currencyRepository.deleteById(id);
    }
    
}
