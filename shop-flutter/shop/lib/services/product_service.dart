import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http_parser/http_parser.dart'; // <-- This is needed
import '../models/product_model.dart';


class ProductService {
  final dio = Dio(BaseOptions(baseUrl: 'http://10.0.2.2:8080/api'));

  Future<List<Product>> fetchFeaturedProducts() async {
    final response = await dio.get('/products/featured');
    return (response.data as List).map((e) => Product.fromJson(e)).toList();
  }

  Future<List<Product>> fetchAllProducts() async {
    final response = await dio.get('/products');
    return (response.data as List).map((e) => Product.fromJson(e)).toList();
  }

  Future<List<Product>> fetchProductsByCategory(String? categoryId) async {
    if (categoryId == null || categoryId == 'null') {
      // fallback to all products or featured (choose based on your app logic)
      return fetchFeaturedProducts();
    }

    final response = await dio.get('/products/category/$categoryId');
    return (response.data as List).map((e) => Product.fromJson(e)).toList();
  }

  Future<Product> fetchProductById(String id) async {
    final response = await dio.get('/products/$id');
    return Product.fromJson(response.data);
  }

  Future<List<String>> fetchImages(String productId) async {
    final response = await dio.get('/products/$productId/images');
    return List<String>.from(response.data);
  }

  Future<void> createProduct({
    required Map<String, dynamic> productData,
    required List<XFile> images,
  }) async {
    final formData = FormData.fromMap({
      'product': MultipartFile.fromString(
        jsonEncode(productData),
        filename: 'product.json',
        contentType: MediaType('application', 'json'),  // from package:http_parser
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