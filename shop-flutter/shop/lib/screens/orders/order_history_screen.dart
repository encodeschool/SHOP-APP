import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../models/order_model.dart';
import '../../services/order_service.dart';


class OrderHistoryScreen extends StatefulWidget {
  const OrderHistoryScreen({super.key});

  @override
  State<OrderHistoryScreen> createState() => _OrderHistoryScreenState();
}

class _OrderHistoryScreenState extends State<OrderHistoryScreen> {
  final OrderService _orderService = OrderService();
  late Future<List<OrderModel>> _orders;

  @override
  void initState() {
    super.initState();
    _orders = _orderService.getUserOrders();
    print(_orders);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("My Orders")),
      body: FutureBuilder<List<OrderModel>>(
        future: _orders,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }

          final orders = snapshot.data!;
          if (orders.isEmpty) {
            return const Center(child: Text("No orders yet."));
          }

          return ListView.builder(
            itemCount: orders.length,
            itemBuilder: (context, index) {
              final order = orders[index];
              return ExpansionTile(
                title: Text("Order: ${order.id.substring(0, 8)} • \$${order.total.toStringAsFixed(2)}"),
                subtitle: Text("${order.status} • ${DateFormat.yMd().add_jm().format(order.createdAt.toLocal())}"),
                children: order.items.map((item) {
                  return ListTile(
                    leading: item.images.isNotEmpty
                        ? Image.network('http://10.0.2.2:8080${item.images.first}', width: 50)
                        : const Icon(Icons.image_not_supported),
                    title: Text(item.productTitle),
                    subtitle: Text("x${item.quantity}"),
                    trailing: Text("\$${(item.pricePerUnit * item.quantity).toStringAsFixed(2)}"),
                  );
                }).toList(),
              );
            },
          );
        },
      ),
    );
  }
}
