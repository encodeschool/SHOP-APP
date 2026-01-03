class OrderItem {
  final String productId;
  final String productTitle;
  final int quantity;
  final double pricePerUnit;
  final List<String> images; // Optional if images are available, else leave empty

  OrderItem({
    required this.productId,
    required this.productTitle,
    required this.quantity,
    required this.pricePerUnit,
    this.images = const [],
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      productId: json['productId'] ?? '',
      productTitle: json['productTitle'] ?? '',
      quantity: json['quantity'] ?? 0,
      pricePerUnit: (json['pricePerUnit'] as num).toDouble(),
      images: [], // Or parse if available in JSON
    );
  }
}
