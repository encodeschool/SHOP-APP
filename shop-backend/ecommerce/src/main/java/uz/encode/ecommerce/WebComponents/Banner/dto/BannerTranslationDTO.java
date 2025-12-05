package uz.encode.ecommerce.WebComponents.Banner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.encode.ecommerce.WebComponents.Banner.entity.BannerTranslation;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BannerTranslationDTO {

    private String language;

    private String title;
    private String description;
    private String buttonText;

    public BannerTranslationDTO(BannerTranslation translation) {
        this.language = translation.getLanguage();
        this.title = translation.getTitle();
        this.description = translation.getDescription();
        this.buttonText = translation.getButtonText();
    }
}
