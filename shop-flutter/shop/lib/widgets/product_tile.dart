import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/product_model.dart';

class ProductTile extends StatelessWidget {
  final Product product;
  const ProductTile({Key? key, required this.product}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Card(
      margin: const EdgeInsets.all(8),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(
            child: product.images.isNotEmpty
                ? ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
              child: Image.network(
                'http://10.0.2.2:8080${product.images.isNotEmpty ? product.images[0] : '/images/default.png'}',
                fit: BoxFit.contain,
                height: 60,
                width: 60,
                errorBuilder: (context, error, stackTrace) => Icon(Icons.broken_image, size: 60),
              ),
            )
                : const Icon(Icons.image, size: 60),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(product.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text('\$${product.price.toStringAsFixed(2)}')
                  ],
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        context.push('/product/${product.id}');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange,
                        shadowColor: Colors.transparent,
                        shape: const CircleBorder(), // <-- Circular shape
                      ),
                      child: Icon(
                          Icons.arrow_forward,
                          color: Colors.white
                      ),
                    )
                  ]
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
