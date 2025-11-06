// core/auth_provider.dart
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthProvider with ChangeNotifier {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  String? _token;
  String? _userId;

  bool get isLoggedIn => _token != null;
  String? get token => _token;
  String? get userId => _userId;

  // Initialize from storage
  Future<void> loadAuthData() async {
    _token = await _storage.read(key: 'token');
    _userId = await _storage.read(key: 'userId');
    notifyListeners();
  }

  Future<void> login(String token, String userId) async {
    _token = token;
    _userId = userId;
    await _storage.write(key: 'token', value: token);
    await _storage.write(key: 'userId', value: userId);
    notifyListeners();
  }

  Future<void> logout() async {
    _token = null;
    _userId = null;
    await _storage.delete(key: 'token');
    await _storage.delete(key: 'userId');
    notifyListeners();
  }
}
