package uz.encode.ecommerce.WebComponents.Banner.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import uz.encode.ecommerce.WebComponents.Banner.dto.BannerResponseDTO;
import uz.encode.ecommerce.WebComponents.Banner.entity.Banner;
import uz.encode.ecommerce.WebComponents.Banner.repository.BannerRepository;
import uz.encode.ecommerce.WebComponents.Banner.service.BannerService;

@Service
public class BannerServiceImpl implements BannerService {

    @Autowired
    private BannerRepository bannerRepository;

    @Value("${upload.path}")
    private String uploadFolderPath;

    @Override
    public List<BannerResponseDTO> findAllBanners() {
        return bannerRepository.findAll().stream().map(this::mapToDto).toList();
    }

    @Override
    public BannerResponseDTO saveBanner(BannerResponseDTO dto, MultipartFile multipartFile) {
        Banner banner = new Banner();
        banner.setTitle(dto.getTitle());
        banner.setDescription(dto.getDescription());
        banner.setButtonText(dto.getButtonText());
        banner.setButtonLink(dto.getButtonLink());

        if (multipartFile != null && !multipartFile.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();
                Path uploadPath = Paths.get(uploadFolderPath);
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                banner.setImage("/images/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload Banner Image");
            }
        }

        bannerRepository.save(banner);
        return mapToDto(banner);
    }

    @Override
    public void deleteBanner(UUID id) {
        bannerRepository.deleteById(id);
    }

    @Override
    public BannerResponseDTO updateBanner(UUID id, BannerResponseDTO dto, MultipartFile multipartFile) {
        Banner existingBanner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found"));

        // Update text fields
        existingBanner.setTitle(dto.getTitle());
        existingBanner.setDescription(dto.getDescription());
        existingBanner.setButtonText(dto.getButtonText());
        existingBanner.setButtonLink(dto.getButtonLink());

        // Handle image update
        if (multipartFile != null && !multipartFile.isEmpty()) {
            try {
                // Optional: delete old image file
                if (existingBanner.getImage() != null) {
                    Path oldFilePath = Paths.get(uploadFolderPath, 
                            existingBanner.getImage().replace("/image/", ""));
                    Files.deleteIfExists(oldFilePath);
                }

                // Save new image
                String fileName = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();
                Path uploadPath = Paths.get(uploadFolderPath);
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                existingBanner.setImage("/images/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload Banner Image");
            }
        }

        Banner updatedBanner = bannerRepository.save(existingBanner);
        return mapToDto(updatedBanner);
    }


    public BannerResponseDTO mapToDto(Banner banner) {
        BannerResponseDTO dto = new BannerResponseDTO();
        dto.setId(banner.getId());
        dto.setTitle(banner.getTitle());
        dto.setDescription(banner.getDescription());
        dto.setButtonText(banner.getButtonText());
        dto.setButtonLink(banner.getButtonLink());
        dto.setImage(banner.getImage());
        return dto;
    }
    
}
