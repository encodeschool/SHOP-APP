package uz.encode.ecommerce.WebComponents.Banner.entity;

import java.util.UUID;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "banner_translations")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BannerTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String language;

    private String title;
    private String description;
    private String buttonText;

    @ManyToOne
    @JoinColumn(name = "banner_id")
    private Banner banner;
}
