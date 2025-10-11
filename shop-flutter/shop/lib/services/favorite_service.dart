import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class FavoriteService {
  final Dio _dio = Dio();
  final _storage = const FlutterSecureStorage();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _storage.read(key: 'token');
    print("🪪 Token: $token"); // debug log
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<List<String>> getFavoriteIds(String userId) async {
    final headers = await _getHeaders();
    final response = await _dio.get(
      'http://10.0.2.2:8080/api/favorites/$userId',
      options: Options(headers: headers),
    );
    return List<String>.from(response.data);
  }

  Future<void> addFavorite(String userId, String productId) async {
    final headers = await _getHeaders();
    await _dio.post(
      'http://10.0.2.2:8080/api/favorites/$userId/$productId',
      options: Options(headers: headers),
    );
  }

  Future<void> removeFavorite(String userId, String productId) async {
    final headers = await _getHeaders();
    await _dio.delete(
      'http://10.0.2.2:8080/api/favorites/$userId/$productId',
      options: Options(headers: headers),
    );
  }
}
