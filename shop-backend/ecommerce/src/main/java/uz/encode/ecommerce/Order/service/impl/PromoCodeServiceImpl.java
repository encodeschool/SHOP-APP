package uz.encode.ecommerce.Order.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uz.encode.ecommerce.Order.entity.PromoCode;
import uz.encode.ecommerce.Order.repository.PromoCodeRepository;
import uz.encode.ecommerce.Order.service.PromoCodeService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uz.encode.ecommerce.Order.dto.PromoCodeDTO;
import uz.encode.ecommerce.Order.entity.PromoCode;
import uz.encode.ecommerce.Order.mapper.PromoCodeMapper;
import uz.encode.ecommerce.Order.repository.PromoCodeRepository;
import uz.encode.ecommerce.Order.service.PromoCodeService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PromoCodeServiceImpl implements PromoCodeService {

    private final PromoCodeRepository promoCodeRepository;

    @Override
    public List<PromoCodeDTO> findAll() {
        return promoCodeRepository.findAll()
                .stream()
                .map(PromoCodeMapper::toDto)
                .toList();
    }

    @Override
    public PromoCodeDTO findById(Long id) {
        PromoCode code = promoCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PromoCode not found"));

        return PromoCodeMapper.toDto(code);
    }

    @Override
    public PromoCodeDTO create(PromoCodeDTO dto) {
        PromoCode saved = promoCodeRepository.save(PromoCodeMapper.toEntity(dto));
        return PromoCodeMapper.toDto(saved);
    }

    @Override
    public PromoCodeDTO update(Long id, PromoCodeDTO dto) {
        PromoCode existing = promoCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PromoCode not found"));

        existing.setCode(dto.getCode());
        existing.setDiscountAmount(dto.getDiscountAmount());
        existing.setDiscountPercent(dto.getDiscountPercent());
        existing.setValidFrom(dto.getValidFrom());
        existing.setValidUntil(dto.getValidUntil());
        existing.setActive(dto.isActive());
        existing.setUsageLimit(dto.getUsageLimit());

        PromoCode updated = promoCodeRepository.save(existing);
        return PromoCodeMapper.toDto(updated);
    }

    @Override
    public void delete(Long id) {
        promoCodeRepository.deleteById(id);
    }
}
