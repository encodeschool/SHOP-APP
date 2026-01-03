import 'package:flutter/material.dart';
import 'package:enroute/widgets/product_tile.dart';
import '../models/product_model.dart';
import '../widgets/product_card.dart';

class CategorySection extends StatelessWidget {
  final String title;
  final IconData? icon;
  final String? image;
  final List<Product> products;
  final String categoryId;
  final VoidCallback? onSeeAll;

  const CategorySection({
  super.key,
  required this.title,
  required this.products,
  required this.categoryId,
  this.icon,
  this.onSeeAll,
  this.image,
  });

  @override
  Widget build(BuildContext context) {
    // Filter products by categoryId
    final filteredProducts =
    products.where((p) => p.categoryId == categoryId).toList();

    if (filteredProducts.isEmpty) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title row with optional icon
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Row(
              children: [
                if (image != null)
                  Image.asset(
                      image!,
                      width: 25
                  ),
                  // Icon(
                  //   icon,
                  //   size: 24,
                  //   color: Colors.red[900],
                  // ),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.red[900],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Horizontal product list
          SizedBox(
            height: 250,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 0),
              itemCount: filteredProducts.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, index) {
                return SizedBox(
                  width: 200, // FIXED WIDTH for horizontal list
                  child: ProductTile(product: filteredProducts[index]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
