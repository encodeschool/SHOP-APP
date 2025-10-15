import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shop/models/banner_model.dart';

class BannerService {
  final apiUrl = dotenv.env['API_URL'] ?? 'https://shop.encode.uz/api';
  final Dio _dio = Dio();
  final _storage = const FlutterSecureStorage();

  Future<List<Banner>> fetchAllBanner() async {
    final response = await _dio.get('$apiUrl/api/banner');
    return (response.data as List).map((e) => Banner.fromJson(e)).toList();
  }
}