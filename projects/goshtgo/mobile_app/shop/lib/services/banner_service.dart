import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shop/core/api_client.dart';
import 'package:shop/models/banner_model.dart';

class BannerService {
  final Dio dio = ApiClient().dio;
  final _storage = const FlutterSecureStorage();

  Future<List<Banner>> fetchAllBanner() async {
    final response = await dio.get('/banner');
    return (response.data as List).map((e) => Banner.fromJson(e)).toList();
  }
}