import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user_model.dart';

class UserService {
  final dio = Dio(BaseOptions(baseUrl: 'http://10.0.2.2:8080/api'));
  final storage = const FlutterSecureStorage();

  // Get User Object
  Future<User?> getUserDetails() async {
    try {
      final token = await storage.read(key: 'token');
      final userId = await storage.read(key: 'userId');

      if (token == null || userId == null) {
        print('Token or User ID is null');
        return null;
      }

      dio.options.headers['Authorization'] = 'Bearer $token';

      final response = await dio.get('/users/$userId');

      return User.fromJson(response.data);
    } catch (e) {
      print('Failed to get user details: $e');
      return null;
    }
  }

  // Fetch user as raw map (used in edit form)
  Future<Map<String, dynamic>> fetchUserProfile() async {
    final token = await storage.read(key: 'token');
    final userId = await storage.read(key: 'userId');

    if (token == null || userId == null) {
      throw Exception("User not logged in");
    }

    dio.options.headers['Authorization'] = 'Bearer $token';
    final response = await dio.get('/users/$userId');
    return response.data;
  }

  // Update user with optional profile picture
  Future<void> updateUserProfile(Map<String, dynamic> data, [File? image]) async {
    final token = await storage.read(key: 'token');

    if (token == null) {
      throw Exception("User not authenticated");
    }

    final formData = FormData.fromMap({
      'data': jsonEncode(data),
      if (image != null)
        'profilePicture': await MultipartFile.fromFile(
          image.path,
          filename: 'profile.jpg',
        ),
    });

    await dio.put(
      '/users/update-profile', // ✅ Make sure this matches your backend
      data: formData,
      options: Options(
        headers: {
          'Authorization': 'Bearer $token',
        },
        contentType: 'multipart/form-data',
      ),
    );
  }
}
