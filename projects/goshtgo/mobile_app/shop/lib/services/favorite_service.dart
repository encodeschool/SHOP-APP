import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class FavoriteService {
  final apiUrl = dotenv.env['API_URL'] ?? 'https://shop.encode.uz/api';
  final Dio _dio = Dio();
  final _storage = const FlutterSecureStorage();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _storage.read(key: 'token');
    print("🪪 Token: $token");
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<List<String>> getFavoriteIds(String userId) async {
    final headers = await _getHeaders();
    final response = await _dio.get(
      '$apiUrl/api/favorites/user/$userId',
      options: Options(headers: headers),
    );

    if (response.data == null) return [];

    final ids = (response.data as List)
        .where((f) => f != null && f['product'] != null && f['product']['id'] != null)
        .map((f) => f['product']['id'].toString().trim()) // trim whitespace
        .toSet()
        .toList();

    return ids;
  }


  Future<void> addFavorite(String userId, String productId) async {
    final headers = await _getHeaders();
    await _dio.post(
      '$apiUrl/api/favorites',
      queryParameters: {
        'userId': userId,
        'productId': productId,
      },
      options: Options(headers: headers),
    );
  }

  Future<void> removeFavorite(String userId, String productId) async {
    final headers = await _getHeaders();
    await _dio.delete(
      '$apiUrl/api/favorites',
      queryParameters: {
        'userId': userId,
        'productId': productId,
      },
      options: Options(headers: headers),
    );
  }
}
