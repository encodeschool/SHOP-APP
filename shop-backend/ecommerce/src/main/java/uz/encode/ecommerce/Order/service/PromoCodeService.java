package uz.encode.ecommerce.Order.service;

import java.util.List;

import uz.encode.ecommerce.Order.dto.PromoCodeDTO;
import uz.encode.ecommerce.Order.entity.PromoCode;

public interface PromoCodeService {
    List<PromoCodeDTO> findAll();

    PromoCodeDTO findById(Long id);

    PromoCodeDTO create(PromoCodeDTO dto);

    PromoCodeDTO update(Long id, PromoCodeDTO dto);

    void delete(Long id);
}
