package uz.encode.ecommerce.Favourite.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import uz.encode.ecommerce.Favourite.entity.Favorite;
import uz.encode.ecommerce.Favourite.repository.FavoriteRepository;
import uz.encode.ecommerce.Favourite.service.FavoriteService;

@Service
@AllArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {
    
    private final FavoriteRepository favoriteRepository;

    @Override
    public Favorite addFavorite(UUID userId, UUID productId) {
        return favoriteRepository.save(
            Favorite.builder()
                    .userId(userId)
                    .productId(productId)
                    .build()
        );
    }

    @Override
    public void removeFavorite(UUID userId, UUID productId) {
        favoriteRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Override
    public List<Favorite> getFavoritesByUserId(UUID userId) {
        return favoriteRepository.findByUserId(userId);
    }

    @Override
    public boolean isFavorite(UUID userId, UUID productId) {
        return favoriteRepository.findByUserIdAndProductId(userId, productId).isPresent();
    }

}
