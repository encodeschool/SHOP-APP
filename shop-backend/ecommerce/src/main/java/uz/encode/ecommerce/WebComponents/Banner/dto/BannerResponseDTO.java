package uz.encode.ecommerce.WebComponents.Banner.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class BannerResponseDTO {
    private UUID id;
    private String image;
    private String title;
    private String description;
    private String buttonText;
    private String buttonLink;
}
