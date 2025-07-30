import 'order_item_model.dart';

class OrderModel {
  final String id;
  final String userId;
  final DateTime createdAt;
  final String status;
  final List<OrderItem> items;
  final double totalPrice;
  final String? clientSecret;

  OrderModel({
    required this.id,
    required this.userId,
    required this.createdAt,
    required this.status,
    required this.items,
    required this.totalPrice,
    this.clientSecret,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      items: (json['items'] as List<dynamic>?)
          ?.map((e) => OrderItem.fromJson(Map<String, dynamic>.from(e)))
          .toList() ??
          [],
      totalPrice: (json['totalPrice'] as num).toDouble(),
      status: json['status'] ?? '',
      createdAt: DateTime.parse(json['createdAt']),
      clientSecret: json['clientSecret'],
    );
  }

  double get total => items.fold(0, (sum, item) => sum + item.pricePerUnit * item.quantity);
}
