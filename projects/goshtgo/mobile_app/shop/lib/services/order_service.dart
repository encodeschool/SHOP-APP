import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:provider/provider.dart';
import 'package:shop/services/category_service.dart';
import '../../core/cart_provider.dart';
import '../models/order_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';


class OrderService {
  final apiUrl = dotenv.env['API_URL'] ?? 'https://shop.encodelate late .uz/api';
  late final dio = Dio(BaseOptions(baseUrl: '$apiUrl/api'));
  final storage = const FlutterSecureStorage();

  Future<bool> placeOrder(BuildContext context) async {
    final cart = context.read<CartProvider>();
    try {
      final token = await storage.read(key: 'token');
      if (token == null) {
        throw Exception('No token found');
      }
      dio.options.headers['Authorization'] = 'Bearer $token';

      // Retrieve userId from storage or API
      final userId = await storage.read(key: 'userId'); // Store userId during login
      if (userId == null) {
        throw Exception('No user ID found');
      }

      // Create Order on backend
      final response = await dio.post("/orders", data: {
        "userId": userId,
        "items": cart.items.map((e) => {
          "productId": e.product.id,
          "quantity": e.quantity,
        }).toList(),
      });

      final clientSecret = response.data['clientSecret'];
      await Stripe.instance.initPaymentSheet(
        paymentSheetParameters: SetupPaymentSheetParameters(
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: "My Shop",
        ),
      );

      // Show Stripe Payment Sheet
      await Stripe.instance.presentPaymentSheet();

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