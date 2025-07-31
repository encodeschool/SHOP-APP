import 'package:flutter/material.dart';
import '../services/favorite_service.dart';

class FavoriteProvider with ChangeNotifier {
  final FavoriteService _service = FavoriteService();
  List<String> _favoriteIds = [];

  List<String> get favoriteIds => _favoriteIds;

  Future<void> loadFavorites(String userId) async {
    _favoriteIds = await _service.getFavoriteProductIds(userId);
    notifyListeners();
  }

  Future<void> toggleFavorite(String userId, String productId) async {
    if (_favoriteIds.contains(productId)) {
      await _service.removeFavorite(userId, productId);
      _favoriteIds.remove(productId);
    } else {
      await _service.addFavorite(userId, productId);
      _favoriteIds.add(productId);
    }
    notifyListeners();
  }

  bool isFavorite(String productId) {
    return _favoriteIds.contains(productId);
  }
}
