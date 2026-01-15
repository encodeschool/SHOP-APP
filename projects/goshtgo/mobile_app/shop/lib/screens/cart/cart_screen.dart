import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shop/l10n/app_localizations.dart';

import '../../core/cart_provider.dart';
import '../checkout/checkout_screen.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context)!;
    final cart = context.watch<CartProvider>();
    final apiUrl = dotenv.env['API_URL'] ?? 'https://shop.encode.uz/api';

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      appBar: AppBar(
        elevation: 0,
        title: Text(loc.cartTitle, style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/home');
            }
          },
        ),
      ),
      body: cart.items.isEmpty
          ? Center(
        child: Text(
          loc.cartEmpty,
          style: const TextStyle(fontSize: 18, color: Colors.grey),
        ),
      )
          : Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: cart.items.length,
              itemBuilder: (context, index) {
                final item = cart.items[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 5,
                        offset: const Offset(0, 3),
                      )
                    ],
                  ),
                  child: Row(
                    children: [
                      item.product.images.isNotEmpty
                          ? ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          '$apiUrl${item.product.images[0]}',
                          width: 60,
                          height: 60,
                          fit: BoxFit.cover,
                          errorBuilder:
                              (context, error, stackTrace) =>
                          const Icon(Icons.broken_image, size: 60),
                        ),
                      )
                          : const Icon(Icons.image, size: 60),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item.product.title,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text("${loc.quantity}: ${item.quantity}"),
                            const SizedBox(height: 6),
                            Row(
                              children: [
                                _quantityButton(
                                  icon: Icons.remove,
                                  onPressed: () =>
                                      cart.decreaseQuantity(item.product),
                                ),
                                const SizedBox(width: 6),
                                _quantityButton(
                                  icon: Icons.add,
                                  onPressed: () =>
                                      cart.increaseQuantity(item.product),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      Text(
                        "${item.totalPrice.toStringAsFixed(2)}",
                        style: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, -3),
                )
              ],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(loc.total, style: const TextStyle(fontSize: 18)),
                    Text(
                      "${cart.totalPrice.toStringAsFixed(2)}",
                      style: const TextStyle(
                          fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const CheckoutScreen()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(
                      loc.checkout,
                      style: const TextStyle(
                          color: Colors.white, fontSize: 16),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _quantityButton({required IconData icon, required VoidCallback onPressed}) {
    return Container(
      height: 28,
      width: 28,
      decoration: BoxDecoration(
        color: Colors.black,
        borderRadius: BorderRadius.circular(6),
      ),
      child: IconButton(
        padding: EdgeInsets.zero,
        iconSize: 16,
        icon: Icon(icon, color: Colors.white),
        onPressed: onPressed,
      ),
    );
  }
}
