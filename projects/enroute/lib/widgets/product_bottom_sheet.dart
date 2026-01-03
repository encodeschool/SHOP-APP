import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:go_router/go_router.dart';

import '../models/product_model.dart';

class ProductBottomSheet extends StatelessWidget {
  final Product product;

  const ProductBottomSheet({required this.product});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(product.title, style: Theme.of(context).textTheme.titleLarge),
          SizedBox(height: 8),
          Text('Price: \$${product.price}'),
          if (product.images.isNotEmpty)
            Image.network(
              '${dotenv.env["API_URL"]}${product.images[0]}', // prepend backend URL
              height: 200,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => context.go('/product/${product.id}'),
            child: Text('View Details'),
          ),
        ],
      ),
    );
  }
}