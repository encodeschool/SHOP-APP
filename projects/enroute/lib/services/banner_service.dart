import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:enroute/core/api_client.dart';
import 'package:enroute/models/banner_model.dart';

class BannerService {
  final Dio dio = ApiClient().dio;
  final _storage = const FlutterSecureStorage();

  Future<String> _getLangCode() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('locale') ?? 'en';
  }

  Future<List<Banner>> fetchAllBanner([String? lang]) async {
    final language = lang ?? await _getLangCode();
    final response = await dio.get('/banner/lang', queryParameters: {'lang': language});

    if (response.statusCode == 200) {
      final allBanners = (response.data as List)
          .map((e) => Banner.fromJson(e))
          .toList();
      return allBanners;
    } else {
      throw Exception('Failed to load translated banner');
    }
  }
}