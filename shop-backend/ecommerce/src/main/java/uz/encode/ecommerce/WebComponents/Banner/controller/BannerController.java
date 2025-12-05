package uz.encode.ecommerce.WebComponents.Banner.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import uz.encode.ecommerce.WebComponents.Banner.dto.BannerResponseDTO;
import uz.encode.ecommerce.WebComponents.Banner.service.BannerService;

@RestController
@RequestMapping("/api/banner")
@Tag(name = "Banner API", description = "Web Components - Banner")
@CrossOrigin(origins = "*")
public class BannerController {
    
    @Autowired
    private BannerService bannerService;

    @GetMapping
    @Operation(summary = "Get All Banners")
    public ResponseEntity<List<BannerResponseDTO>> getAllBanners() {
        return ResponseEntity.ok(bannerService.findAllBanners());
    }

    @GetMapping("/lang")
    @Operation(summary = "Get All Banners with Language")
    public ResponseEntity<List<BannerResponseDTO>> getAllBanners(
            @RequestParam(defaultValue = "en") String lang) {
        return ResponseEntity.ok(bannerService.findAllBanners(lang));
    }

    @PostMapping(consumes = "multipart/form-data")
    @Operation(summary = "Save Banner")
    public ResponseEntity<BannerResponseDTO> saveBanner(
            @RequestPart("banner") BannerResponseDTO bannerDto,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        BannerResponseDTO saved = bannerService.saveBanner(bannerDto, image);
        return ResponseEntity.ok(saved);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    @Operation(summary = "Update Banner")
    public ResponseEntity<BannerResponseDTO> updateBanner(
            @PathVariable UUID id,
            @RequestPart("banner") BannerResponseDTO bannerDto,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        BannerResponseDTO updated = bannerService.updateBanner(id, bannerDto, image);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Banner")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }
}
