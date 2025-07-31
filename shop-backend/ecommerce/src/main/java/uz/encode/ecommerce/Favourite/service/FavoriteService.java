package uz.encode.ecommerce.Favourite.service;

import java.util.List;
import java.util.UUID;

import uz.encode.ecommerce.Favourite.entity.Favorite;


public interface FavoriteService {
    
    Favorite addFavorite(UUID userId, UUID productId);

    void removeFavorite(UUID userId, UUID productId);

    List<Favorite> getFavoritesByUserId(UUID userId);

    boolean isFavorite(UUID userId, UUID productId);

}
