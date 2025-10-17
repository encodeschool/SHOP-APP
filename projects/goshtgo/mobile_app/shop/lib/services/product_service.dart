import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http_parser/http_parser.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/product_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ProductService {
  final apiUrl = dotenv.env['API_URL'] ?? 'https://shop.encode.uz/api';
  late final dio = Dio(BaseOptions(baseUrl: '$apiUrl/api'));

  /// Get the current language code from SharedPreferences
  Future<String> _getLangCode() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('locale') ?? 'en';
  }

  /// Fetch featured products, optionally translated
  Future<List<Product>> fetchFeaturedProducts({String? lang}) async {
    final language = lang ?? await _getLangCode();
    final response = await dio.get('/products/lang', queryParameters: {'lang': language});
    return (response.data as List).map((e) => Product.fromJson(e)).toList();
  }

  /// Fetch all products, optionally translated
  Future<List<Product>> fetchAllProducts({String? lang}) async {
    final language = lang ?? await _getLangCode();
    final response = await dio.get('/products/lang', queryParameters: {'lang': language});
    return (response.data as List).map((e) => Product.fromJson(e)).toList();
  }

  /// Fetch products by category, optionally translated
  Future<List<Product>> fetchProductsByCategory(String? categoryId, {String? lang}) async {
    final language = lang ?? await _getLangCode();
    if (categoryId == null || categoryId == 'null') {
      return fetchFeaturedProducts(lang: language);
    }
    final response = await dio.get('/products/category/$categoryId', queryParameters: {'lang': language});
    return (response.data as List).map((e) => Product.fromJson(e)).toList();
  }

  /// Fetch single product by ID, optionally translated
  Future<Product> fetchProductById(String id, {String? lang}) async {
    final language = lang ?? await _getLangCode();
    final response = await dio.get('/products/lang/$id', queryParameters: {'lang': language});
    return Product.fromJson(response.data);
  }

  /// Fetch product images
  Future<List<String>> fetchImages(String productId) async {
    final response = await dio.get('/products/$productId/images');
    return List<String>.from(response.data);
  }

  /// Search products, optionally translated
  Future<List<Product>> searchProducts(String query, {String? lang}) async {
    final language = lang ?? await _getLangCode();
    final response = await dio.get('/products/search', queryParameters: {
      'q': query,
      'lang': language,
    });
    return (response.data as List).map((e) => Product.fromJson(e)).toList();
  }

  /// Create a new product with images
  Future<void> createProduct({
    required Map<String, dynamic> productData,
    required List<XFile> images,
  }) async {
    final formData = FormData.fromMap({
      'product': MultipartFile.fromString(
        jsonEncode(productData),
        filename: 'product.json',
        contentType: MediaType('application', 'json'),
      ),
      'images': images.map(
            (xfile) => MultipartFile.fromFileSync(
          xfile.path,
          filename: xfile.name,
        ),
      ).toList(),
    });

    await dio.post('/products', data: formData);
  }
}
