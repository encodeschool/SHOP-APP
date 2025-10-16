import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shop/l10n/app_localizations.dart';

import '../../core/cart_provider.dart';
import '../checkout/checkout_screen.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context)!; // localization
    final cart = context.watch<CartProvider>();
    final apiUrl = dotenv.env['API_URL'] ?? 'https://shop.encode.uz/api';

    return Scaffold(
      appBar: AppBar(title: Text(loc.cartTitle)),
      body: cart.items.isEmpty
          ? Center(child: Text(loc.cartEmpty))
          : Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: cart.items.length,
              itemBuilder: (context, index) {
                final item = cart.items[index];
                return ListTile(
                  leading: item.product.images.isNotEmpty
                      ? Image.network(
                    '$apiUrl${item.product.images[0]}',
                    width: 50,
                    height: 50,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                    const Icon(Icons.broken_image),
                  )
                      : const Icon(Icons.image, size: 50),
                  title: Text(item.product.title),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("${loc.quantity}: ${item.quantity}"),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove),
                            onPressed: () => cart.decreaseQuantity(item.product),
                          ),
                          IconButton(
                            icon: const Icon(Icons.add),
                            onPressed: () => cart.increaseQuantity(item.product),
                          ),
                        ],
                      ),
                    ],
                  ),
                  trailing: Text("\$${item.totalPrice.toStringAsFixed(2)}"),
                );
              },
            ),
          ),
          const Divider(),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(loc.total, style: const TextStyle(fontSize: 18)),
                    Text(
                      "\$${cart.totalPrice.toStringAsFixed(2)}",
                      style: const TextStyle(fontSize: 18),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const CheckoutScreen()),
                    );
                  },
                  child: Text(
                    loc.checkout,
                    style: const TextStyle(color: Colors.white),
                  ),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.black),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
