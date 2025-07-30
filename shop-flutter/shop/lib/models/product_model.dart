import 'package:shop/models/user_model.dart';

class Product {
  final String id;
  final String title;
  final String description;
  final double price;
  final int stock;
  final int quantity;
  final bool featured;
  final bool available;
  final String condition;
  final User user;
  final List<String> images;

  Product({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.stock,
    required this.quantity,
    required this.featured,
    required this.available,
    required this.condition,
    required this.user,
    required this.images,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      price: (json['price'] as num).toDouble(),
      stock: json['stock'] ?? 0,
      quantity: json['quantity'] ?? 0,
      featured: json['featured'] ?? false,
      available: json['available'] ?? false,
      condition: json['condition'] ?? 'NEW',
      user: json['user'] != null
          ? User.fromJson(json['user'])
          : User(id: json['id'], name: json['name'], email: json['email'], username: json['username'], roles: json['roles']),
      images: List<String>.from(json['imageUrls'] ?? []), // <-- FIXED HERE
    );
  }
}