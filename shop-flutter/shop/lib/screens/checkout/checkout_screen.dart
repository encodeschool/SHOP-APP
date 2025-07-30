import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/cart_provider.dart';
import '../../services/order_service.dart';

class CheckoutScreen extends StatelessWidget {
  const CheckoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final orderService = OrderService();

    return Scaffold(
      appBar: AppBar(title: const Text("Checkout")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const Text("Confirm Your Order", style: TextStyle(fontSize: 20)),
            const SizedBox(height: 20),
            ...cart.items.map((item) => ListTile(
              leading: item.product.images.isNotEmpty
                  ? Image.network(
                'http://10.0.2.2:8080${item.product.images[0]}', // prepend backend URL
                width: 50,
                height: 50,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => const Icon(Icons.broken_image),
              )
                  : const Icon(Icons.image, size: 50),
              title: Text(item.product.title),
              subtitle: Text("x${item.quantity}"),
              trailing: Text("\$${item.totalPrice.toStringAsFixed(2)}"),
            )),
            const Divider(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("Total", style: TextStyle(fontSize: 18)),
                Text("\$${cart.totalPrice.toStringAsFixed(2)}", style: const TextStyle(fontSize: 18)),
              ],
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () async {
                final success = await orderService.placeOrder(context);
                if (success && context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Payment successful")));
                  Navigator.pushReplacementNamed(context, '/success');
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Payment failed")));
                }
              },
              child: const Text(
                  "Pay & Place Order",
                  style: TextStyle(
                    color: Colors.white
                  )
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black
              )
            )
          ],
        ),
      ),
    );
  }
}
