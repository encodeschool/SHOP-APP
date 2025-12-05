package uz.encode.ecommerce.WebComponents.Banner.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import uz.encode.ecommerce.Category.dto.CategoryTranslationDTO;
import uz.encode.ecommerce.Category.entity.CategoryTranslation;
import uz.encode.ecommerce.WebComponents.Banner.dto.BannerResponseDTO;
import uz.encode.ecommerce.WebComponents.Banner.dto.BannerTranslationDTO;
import uz.encode.ecommerce.WebComponents.Banner.entity.Banner;
import uz.encode.ecommerce.WebComponents.Banner.entity.BannerTranslation;
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
        // Handle translations
        if (dto.getTranslations() != null) {

            Set<String> languages = new HashSet<>();

            List<BannerTranslation> translations =
                dto.getTranslations()
                    .stream()
                    .filter(t ->
                        (t.getTitle() != null && !t.getTitle().isBlank()) ||
                        (t.getDescription() != null && !t.getDescription().isBlank()) ||
                        (t.getButtonText() != null && !t.getButtonText().isBlank())
                    )
                    .map(t -> {

                        if (!languages.add(t.getLanguage())) {
                            throw new IllegalArgumentException(
                                    "Duplicate language: " + t.getLanguage());
                        }

                        BannerTranslation tr = new BannerTranslation();
                        tr.setLanguage(t.getLanguage());
                        tr.setTitle(t.getTitle());
                        tr.setDescription(t.getDescription());
                        tr.setButtonText(t.getButtonText());
                        tr.setBanner(banner);

                        return tr;
                    })
                    .collect(Collectors.toList());

            banner.setTranslations(translations);
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

        Banner existing = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found"));

        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setButtonText(dto.getButtonText());
        existing.setButtonLink(dto.getButtonLink());

        // Handle image update
        if (multipartFile != null && !multipartFile.isEmpty()) {
            try {
                // Optional: delete old image file
                if (existing.getImage() != null) {
                    Path oldFilePath = Paths.get(uploadFolderPath, 
                            existing.getImage().replace("/image/", ""));
                    Files.deleteIfExists(oldFilePath);
                }

                // Save new image
                String fileName = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();
                Path uploadPath = Paths.get(uploadFolderPath);
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                existing.setImage("/images/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload Banner Image");
            }
        }

        // Update translations
        Map<String, BannerTranslation> existingMap =
                existing.getTranslations().stream()
                    .collect(Collectors.toMap(
                            BannerTranslation::getLanguage,
                            t -> t,
                            (a, b) -> a
                    ));

        existing.getTranslations().clear();

        Set<String> seenLanguages = new HashSet<>();

        for (BannerTranslationDTO t : dto.getTranslations()) {

            if (!seenLanguages.add(t.getLanguage())) {
                throw new IllegalArgumentException("Duplicate lang: " + t.getLanguage());
            }

            BannerTranslation tr =
                    existingMap.getOrDefault(t.getLanguage(), new BannerTranslation());

            tr.setLanguage(t.getLanguage());
            tr.setTitle(t.getTitle());
            tr.setDescription(t.getDescription());
            tr.setButtonText(t.getButtonText());
            tr.setBanner(existing);

            existing.getTranslations().add(tr);
        }

        Banner updated = bannerRepository.save(existing);
        return mapToDto(updated);
    }


    public List<BannerResponseDTO> getAll(String lang) {
        List<Banner> banners = bannerRepository.findAll();
        Map<UUID, Banner> uniqueBanners = new LinkedHashMap<>();
        for (Banner banner : banners) {
            if (uniqueBanners.containsKey(banner.getId())) {
                System.err.println("Duplicate banner ID found in DB: " + banner.getId());
                continue;
            }
            uniqueBanners.put(banner.getId(), banner);
        }

        return uniqueBanners.values().stream()
                            .map(banner -> new BannerResponseDTO(banner, lang))
                            .collect(Collectors.toList());
    }


    public BannerResponseDTO mapToDto(Banner banner) {
        BannerResponseDTO dto = new BannerResponseDTO();
        dto.setId(banner.getId());
        dto.setTitle(banner.getTitle());
        dto.setDescription(banner.getDescription());
        dto.setButtonText(banner.getButtonText());
        dto.setButtonLink(banner.getButtonLink());
        dto.setImage(banner.getImage());

        if (banner.getTranslations() != null) {
            List<BannerTranslationDTO> translations = banner.getTranslations()
                .stream()
                .map(BannerTranslationDTO::new)
                .collect(Collectors.toList());

            dto.setTranslations(translations);
        }

        return dto;
    }

    @Override
    public List<BannerResponseDTO> findAllBanners(String lang) {
        return getAll(lang);
    }
    
}
