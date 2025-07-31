import 'package:dio/dio.dart';

class FavoriteService {
  final _dio = Dio(BaseOptions(baseUrl: 'http://10.0.2.2:8080/api'));

  Future<void> addFavorite(String userId, String productId) async {
    await _dio.post('/favorites', data: {
      'userId': userId,
      'productId': productId,
    });
  }

  Future<void> removeFavorite(String userId, String productId) async {
    await _dio.delete('/favorites/$userId/$productId');
  }

  Future<List<String>> getFavoriteIds(String userId) async {
    final res = await _dio.get('/favorites/user/$userId');
    return List<String>.from(res.data);
  }
}
