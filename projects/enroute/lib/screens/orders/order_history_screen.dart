import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:enroute/l10n/app_localizations.dart';

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
  final apiUrl = dotenv.env['API_URL'] ?? 'https://shop.encode.uz/api';

  @override
  void initState() {
    super.initState();
    _orders = _orderService.getUserOrders();
  }

  Color? getStatusColor(String status) {
    switch (status) {
      case "PENDING":
        return Colors.red[300];
      case "PAID":
        return Colors.green[300];
      case "CANCELLED":
        return Colors.grey[400];
      default:
        return Colors.blue[300];
    }
  }

  String? getStatusText(String text) {
    final loc = AppLocalizations.of(context)!;
    switch (text) {
      case "DELIVERED":
        return loc.delivered;
      case "PAID":
        return loc.paid;
      case "CANCELLED":
        return loc.cancelled;
      case "SHIPPED":
        return loc.shipped;
      default:
        return loc.pending;
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(loc.orderHistoryTitle),
        leading: IconButton(
          onPressed: () => context.go('/profile'),
          icon: const Icon(Icons.arrow_back),
        ),
      ),
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
            return Center(child: Text(loc.noOrders));
          }

          return ListView.builder(
            itemCount: orders.length,
            itemBuilder: (context, index) {
              final order = orders[index];

              return ExpansionTile(
                title: Text(
                  "${loc.orderNumber}: ${order.id.substring(0, 8)} • ${order.total.toStringAsFixed(2)}",
                ),
                subtitle: Row(
                  children: [
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 2),
                      decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(15),
                          border: Border.all(
                            width: 1,
                            color: getStatusColor(order.status)!
                          )
                      ),
                      child: Text(
                        getStatusText(order.status)!,
                        style: TextStyle(
                            color: getStatusColor(order.status)
                        ),
                      ),
                    ),
                    SizedBox(width: 5),
                    Text(
                      "${DateFormat.yMd().add_jm().format(order.createdAt.toLocal())}"
                    )
                  ],
                ),
                children: order.items.map((item) {
                  return ListTile(
                    leading: item.images.isNotEmpty
                        ? Image.network('$apiUrl${item.images.first}', width: 50)
                        : const Icon(Icons.image_not_supported),
                    title: Text(item.productTitle),
                    subtitle: Text("${loc.quantity}: ${item.quantity}"),
                    trailing: Text("${(item.pricePerUnit * item.quantity).toStringAsFixed(2)}"),
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
