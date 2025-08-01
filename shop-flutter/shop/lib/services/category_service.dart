import 'dart:convert';

import 'package:dio/dio.dart';

import '../models/category_model.dart';


class CategoryService {
  final dio = Dio(BaseOptions(baseUrl: 'http://10.0.2.2:8080/api'));

  /// Fetches root categories.
  Future<List<Category>> fetchRootCategories() async {
    final response = await dio.get('/categories/root-categories');
    return (response.data as List).map((e) => Category.fromJson(e)).toList();
  }

  /// Fetches subcategories of a given category.
  /// If `parentId` is null or 'null', it will fetch root categories instead.
  Future<List<Category>> fetchSubcategories(String? parentId) async {
    if (parentId == null || parentId == 'null') {
      // fallback to root categories
      return fetchRootCategories();
    }

    final response = await dio.get('/categories/$parentId/subcategories');
    return (response.data as List).map((e) => Category.fromJson(e)).toList();
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