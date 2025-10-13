import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:provider/provider.dart';
import '../../core/cart_provider.dart';
import '../models/order_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class OrderService {
  final apiUrl = dotenv.env['API_URL'] ?? 'https://shop.encode.uz/api';
  late final dio = Dio(BaseOptions(baseUrl: '$apiUrl/api'));
  final storage = const FlutterSecureStorage();

  // ✅ Place order with full payload
  Future<bool> placeOrder(BuildContext context, {required Map<String, dynamic> payload}) async {
    final cart = context.read<CartProvider>();
    try {
      final token = await storage.read(key: 'token');
      if (token == null) throw Exception('No token found');
      dio.options.headers['Authorization'] = 'Bearer $token';

      final response = await dio.post("/orders", data: payload);

      // Optional: Stripe Payment
      if (response.data['clientSecret'] != null) {
        final clientSecret = response.data['clientSecret'];
        await Stripe.instance.initPaymentSheet(
          paymentSheetParameters: SetupPaymentSheetParameters(
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: "My Shop",
          ),
        );
        await Stripe.instance.presentPaymentSheet();
      }

      cart.clearCart();
      return true;
    } catch (e) {
      debugPrint("Payment failed: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Payment failed: $e")),
      );
      return false;
    }
  }

  // ✅ Apply promo code
  Future<Map<String, dynamic>> applyPromo(String code, double total) async {
    try {
      final response = await dio.post('/promo/apply', queryParameters: {
        'code': code,
        'total': total,
      });
      return response.data; // { "newTotal": 120.0 }
    } catch (e) {
      debugPrint("Promo failed: $e");
      throw Exception("Invalid or expired promo code");
    }
  }

  // ✅ Get user's orders
  Future<List<OrderModel>> getUserOrders() async {
    final token = await storage.read(key: 'token');
    final userId = await storage.read(key: 'userId');
    if (token == null || userId == null) throw Exception('Not logged in');

    dio.options.headers['Authorization'] = 'Bearer $token';

    final response = await dio.get('/orders/user/$userId');

    if (response.data == null || response.data is! List) {
      throw Exception('Invalid response format from server');
    }

    return (response.data as List)
        .where((e) => e != null)
        .map((e) => OrderModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
