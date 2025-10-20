// lib/core/network_manager.dart
import 'dart:async';
import 'dart:io';
import 'package:connectivity_plus/connectivity_plus.dart';

class NetworkManager {
  static final _instance = NetworkManager._internal();
  factory NetworkManager() => _instance;
  NetworkManager._internal();

  final Connectivity _connectivity = Connectivity();
  final StreamController<bool> _controller = StreamController<bool>.broadcast();

  Stream<bool> get connectionStream => _controller.stream;

  void initialize() {
    _connectivity.onConnectivityChanged.listen((result) async {
      bool hasConnection = result != ConnectivityResult.none;

      if (hasConnection) {
        try {
          final lookup = await InternetAddress.lookup('shop.encode.uz')
              .timeout(const Duration(seconds: 3));
          hasConnection =
              lookup.isNotEmpty && lookup.first.rawAddress.isNotEmpty;
        } catch (_) {
          hasConnection = false;
        }
      }

      _controller.add(hasConnection);
    });
  }

  void dispose() => _controller.close();
}
