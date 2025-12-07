package uz.encode.ecommerce.Order.mapper;

import uz.encode.ecommerce.Order.dto.PromoCodeDTO;
import uz.encode.ecommerce.Order.entity.PromoCode;

public class PromoCodeMapper {

    public static PromoCodeDTO toDto(PromoCode entity) {
        if (entity == null) return null;

        return PromoCodeDTO.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .discountAmount(entity.getDiscountAmount())
                .discountPercent(entity.getDiscountPercent())
                .validFrom(entity.getValidFrom())
                .validUntil(entity.getValidUntil())
                .active(entity.isActive())
                .usageLimit(entity.getUsageLimit())
                .timesUsed(entity.getTimesUsed())
                .build();
    }

    public static PromoCode toEntity(PromoCodeDTO dto) {
        if (dto == null) return null;

        return PromoCode.builder()
                .id(dto.getId())
                .code(dto.getCode())
                .discountAmount(dto.getDiscountAmount())
                .discountPercent(dto.getDiscountPercent())
                .validFrom(dto.getValidFrom())
                .validUntil(dto.getValidUntil())
                .active(dto.isActive())
                .usageLimit(dto.getUsageLimit())
                .timesUsed(dto.getTimesUsed())
                .build();
    }
}
