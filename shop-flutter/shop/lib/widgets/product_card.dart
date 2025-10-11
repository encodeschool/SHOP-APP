import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../models/product_model.dart';

class ProductCard extends StatelessWidget {
  final Product product;

  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    final primaryColor = Colors.red[900];
    return Card(
      color: Colors.white,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 0,
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: SizedBox(
          width: 60,
          height: 60,
          child: product.images.isNotEmpty
              ? ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.network(
              'http://10.0.2.2:8080${product.images[0]}', // prepend backend URL
              fit: BoxFit.cover,
            ),
          )
              : const Icon(Icons.image, size: 40),
        ),
        title: Text(product.title, maxLines: 1, overflow: TextOverflow.ellipsis),
        subtitle: Text("\$${product.price}"),
        trailing: Icon(
            Icons.arrow_forward_ios,
            size: 24,
            color: primaryColor
        ),
        onTap: () {
          context.push('/product/${product.id}');
        },
      ),
    );
  }
}
