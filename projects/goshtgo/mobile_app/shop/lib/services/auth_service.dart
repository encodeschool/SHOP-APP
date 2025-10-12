import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AuthService {
  final apiUrl = dotenv.env['API_URL'] ?? 'https://shop.encode.uz/api';
  late final Dio dio = Dio(BaseOptions(baseUrl: '$apiUrl/api'));
  final storage = const FlutterSecureStorage();

  Future<bool> login(String email, String password) async {
    try {
      final response = await dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      print('Login response: ${response.data}'); // Debug
      final token = response.data['token'];
      final userId = response.data['userId'];
      if (token == null) {
        print('No token found in login response');
        return false;
      }
      await storage.write(key: 'token', value: token);
      await storage.write(key: 'userId', value: userId); // ✅ Save userId
      dio.options.headers['Authorization'] = 'Bearer $token';
      return true;
    } catch (e) {
      print('Login failed: $e');
      return false;
    }
  }

  Future<void> saveAuthData(String token, String userId) async {
    await storage.write(key: 'token', value: token);
    await storage.write(key: 'userId', value: userId);
  }

  Future<void> logout() async {
    await storage.delete(key: 'token');
    await storage.delete(key: 'userId');
    dio.options.headers.remove('Authorization');
  }

  Future<bool> isLoggedIn() async {
    final token = await storage.read(key: 'token');
    return token != null;
  }

  Future<bool> register({
    required String name,
    required String email,
    required String username,
    required String phone,
    required String password,
  }) async {
    try {
      final response = await dio.post('/auth/register', data: {
        'name': name,
        'email': email,
        'username': username,
        'phone': phone,
        'password': password,
      });

      print('Register response: ${response.data}'); // Debug
      final token = response.data['token'];
      if (token == null) {
        print('No token found in register response');
        return false;
      }
      await storage.write(key: 'token', value: token);
      dio.options.headers['Authorization'] = 'Bearer $token';
      return true;
    } catch (e) {
      print('Registration failed: $e');
      return false;
    }
  }

  Future<String?> getUserId() async {
    return await storage.read(key: 'userId');
  }

  Future<String?> getToken() async {
    return await storage.read(key: 'token');
  }


}