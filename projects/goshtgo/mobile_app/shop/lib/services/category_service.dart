import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/api_client.dart';
import '../models/category_model.dart';


final appName = dotenv.env['APP_NAME'] ?? 'GoshtGo';

class CategoryService {
  final Dio dio = ApiClient().dio;

  Future<String> _getLangCode() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('locale') ?? 'ru';
  }

  /// Fetches root categories.
  Future<List<Category>> fetchRootCategories([String? lang]) async {
    final language = lang ?? await _getLangCode();
    final response = await dio.get('/categories/lang', queryParameters: {'lang': language});

    if (response.statusCode == 200) {
      final allCategories = (response.data as List)
          .map((e) => Category.fromJson(e))
          .toList();

      // Filter only root categories (parentId == null)
      return allCategories.where((c) => c.parentId == null).toList();
    } else {
      throw Exception('Failed to load translated root categories');
    }
  }

  /// Fetches subcategories of a given category.
  /// If `parentId` is null or 'null', it will fetch root categories instead.
  Future<List<Category>> fetchSubcategories(String? parentId, [String? lang]) async {
    final language = lang ?? await _getLangCode();
    final response = await dio.get('/categories/lang', queryParameters: {'lang': language});

    if (response.statusCode == 200) {
      final allCategories = (response.data as List)
          .map((e) => Category.fromJson(e))
          .toList();

      if (parentId == null || parentId == 'null') {
        return allCategories.where((c) => c.parentId == null).toList();
      } else {
        return allCategories.where((c) => c.parentId?.toString() == parentId).toList();
      }
    } else {
      throw Exception('Failed to load translated subcategories');
    }
  }

  Future<List<Map<String, dynamic>>> fetchCategories() async {
    final response = await dio.get('/categories');

    if (response.statusCode == 200) {
      final List data = response.data; // Already decoded by Dio
      return data.map<Map<String, dynamic>>((c) => {
        "id": c['id'].toString(), // Ensure it's String
        "name": c['name'],
      }).toList();
    } else {
      throw Exception('Failed to load categories');
    }
  }
}