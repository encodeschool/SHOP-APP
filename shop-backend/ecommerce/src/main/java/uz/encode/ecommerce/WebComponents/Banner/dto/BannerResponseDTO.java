package uz.encode.ecommerce.WebComponents.Banner.dto;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.encode.ecommerce.Category.dto.CategoryTranslationDTO;
import uz.encode.ecommerce.WebComponents.Banner.entity.Banner;
import uz.encode.ecommerce.WebComponents.Banner.entity.BannerTranslation;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BannerResponseDTO {
    private UUID id;
    private String image;
    private String title;
    private String description;
    private String buttonText;
    private String buttonLink;
    private List<BannerTranslationDTO> translations;
    private String lang;

    public BannerResponseDTO(Banner banner, String language) {
        this.id = banner.getId();
        this.image = banner.getImage();
        this.buttonLink = banner.getButtonLink();

        BannerTranslationDTO translation = null;
        if (banner.getTranslations() != null) {
            translation = banner.getTranslations().stream()
                    .filter(t -> t.getLanguage().equalsIgnoreCase(language))
                    .map(BannerTranslationDTO::new)
                    .findFirst()
                    .orElse(null);
        }

        this.title = translation != null ? translation.getTitle() : banner.getTitle();
        this.description = translation != null ? translation.getDescription() : banner.getDescription();
        this.buttonText = translation != null ? translation.getButtonText() : banner.getButtonText();

        this.translations = banner.getTranslations() != null
                ? banner.getTranslations().stream().map(BannerTranslationDTO::new).collect(Collectors.toList())
                : List.of();

        this.lang = language;
    }

}
