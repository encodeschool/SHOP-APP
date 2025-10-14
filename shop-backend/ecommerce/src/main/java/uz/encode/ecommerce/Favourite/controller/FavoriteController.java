package uz.encode.ecommerce.Favourite.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Favourite.entity.Favorite;
import uz.encode.ecommerce.Favourite.service.FavoriteService;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
// @PreAuthorize("isAuthenticated()")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<Favorite> addFavorite(@RequestParam UUID userId, @RequestParam UUID productId) {
        return ResponseEntity.ok(favoriteService.addFavorite(userId, productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> removeFavorite(@RequestParam UUID userId, @RequestParam UUID productId) {
        favoriteService.removeFavorite(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Favorite>> getFavorites(@PathVariable UUID userId) {
        return ResponseEntity.ok(favoriteService.getFavoritesByUserId(userId));
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> isFavorite(@RequestParam UUID userId, @RequestParam UUID productId) {
        return ResponseEntity.ok(favoriteService.isFavorite(userId, productId));
    }
}
