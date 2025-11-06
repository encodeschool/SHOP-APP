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
  final String categoryId; // <-- add this
  final String brandName;
  final String brandId;

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
    required this.categoryId, // <-- add this
    required this.brandName,
    required this.brandId,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    User fallbackUser = User(
      id: json['user']?['id'] ?? '',
      name: json['user']?['name'] ?? 'Unknown',
      email: json['user']?['email'] ?? '',
      phone: json['phone']?['phone']?? '',
      username: json['user']?['username'] ?? '',
      roles: List<String>.from(json['user']?['roles'] ?? []),
    );

    return Product(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      stock: json['stock'] ?? 0,
      quantity: json['quantity'] ?? 0,
      featured: json['featured'] ?? false,
      available: json['available'] ?? false,
      condition: json['condition'] ?? 'NEW',
      user: json['user'] != null ? User.fromJson(json['user']) : fallbackUser,
      images: List<String>.from(json['imageUrls'] ?? []),
      categoryId: json['categoryId'] ?? '', // <-- map from JSON
      brandName: json['brandName'] ?? '',
      brandId: json['brandId'] ?? '',
    );
  }
}