import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/cart_provider.dart';
import '../checkout/checkout_screen.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text("Your Cart")),
      body: cart.items.isEmpty
          ? const Center(child: Text("Cart is empty"))
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
                    'http://10.0.2.2:8080${item.product.images[0]}',
                    width: 50,
                    height: 50,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => const Icon(Icons.broken_image),
                  )
                      : const Icon(Icons.image, size: 50),
                  title: Text(item.product.title),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Text("Quantity: ${item.quantity}"),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
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
                    const Text("Total:", style: TextStyle(fontSize: 18)),
                    Text("\$${cart.totalPrice.toStringAsFixed(2)}",
                        style: const TextStyle(fontSize: 18)),
                  ],
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {
                    // Navigate to Checkout Screen
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const CheckoutScreen()),
                    );
                  },
                  child: const Text(
                      "Proceed to Checkout",
                      style: TextStyle(
                        color: Colors.white
                      )
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black
                  )
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}