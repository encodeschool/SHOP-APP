package uz.encode.ecommerce.WebComponents.Banner.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import uz.encode.ecommerce.WebComponents.Banner.dto.BannerResponseDTO;

@Service
public interface BannerService {
    
    List<BannerResponseDTO> findAllBanners();

    List<BannerResponseDTO> findAllBanners(String lang);

    BannerResponseDTO saveBanner(BannerResponseDTO banner, MultipartFile multipartFile);

    void deleteBanner(UUID id);

    BannerResponseDTO updateBanner(UUID id, BannerResponseDTO banner, MultipartFile multipartFile);

}
