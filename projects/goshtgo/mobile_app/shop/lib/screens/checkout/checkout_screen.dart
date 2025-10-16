import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../../core/cart_provider.dart';
import '../../models/user_model.dart';
import '../../services/order_service.dart';
import 'package:go_router/go_router.dart';
import '../../services/user_service.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _promoController = TextEditingController();
  final storage = const FlutterSecureStorage();

  // Controllers for dynamic user data
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _countryController = TextEditingController();
  final _zipController = TextEditingController();
  final _cityController = TextEditingController();
  final _notesController = TextEditingController();

  bool isLegalEntity = false;
  String shippingMethod = 'standard';
  String paymentMethod = 'card';
  bool agreeToTerms = false;

  double discount = 0;
  String? promoError;
  bool loading = false;

  bool isLoggedIn = false;
  String? userId;

  // Legal entity fields
  String companyName = '', registrationNr = '', vatNumber = '', legalAddress = '';

  @override
  void initState() {
    super.initState();
    _checkLoginAndLoadUser();
  }

  Future<User?> _loadUser() async {
    final userService = UserService();
    return await userService.getUserDetails();
  }

  Future<void> _checkLoginAndLoadUser() async {
    final token = await storage.read(key: 'token');
    userId = await storage.read(key: 'userId');

    if (token == null || userId == null) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Please login to proceed with checkout")),
        );
        context.go('/login?redirect=/checkout');
      }
      return;
    }

    setState(() => isLoggedIn = true);

    final user = await _loadUser();
    if (user != null && mounted) {
      // Fill controllers with user data
      _nameController.text = user.name;
      _emailController.text = user.email;
      _phoneController.text = user.phone;
      // _phoneController.text = user.phone ?? '';
      // _countryController.text = user.country ?? '';
      // _zipController.text = user.zip ?? '';
      // _cityController.text = user.city ?? '';
      // _notesController.text = user.notes ?? '';
      //
      // if (user.isLegalEntity ?? false) {
      //   setState(() {
      //     isLegalEntity = true;
      //     companyName = user.companyName ?? '';
      //     registrationNr = user.registrationNr ?? '';
      //     vatNumber = user.vatNumber ?? '';
      //     legalAddress = user.legalAddress ?? '';
      //   });
      // }
    }
  }

  Future<void> applyPromo(double totalPrice) async {
    setState(() => promoError = null);
    try {
      final orderService = OrderService();
      final response = await orderService.applyPromo(_promoController.text, totalPrice);
      final newTotal = response['newTotal'];
      setState(() {
        discount = totalPrice - newTotal;
      });
    } catch (e) {
      setState(() {
        promoError = "Invalid or expired promo code";
        discount = 0;
      });
    }
  }

  Future<void> submitOrder(BuildContext context, CartProvider cart) async {
    if (!_formKey.currentState!.validate()) return;
    if (!agreeToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("You must accept the terms")),
      );
      return;
    }

    if (userId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("User not found. Please login again.")),
      );
      return;
    }

    _formKey.currentState!.save();
    setState(() => loading = true);

    final shippingPrice = shippingMethod == 'express' ? 15.0 : 5.0;
    final totalPrice = cart.totalPrice + shippingPrice - discount;

    final checkoutPayload = {
      "userId": userId,
      "items": cart.items
          .map((item) => {
        "productId": item.product.id,
        "quantity": item.quantity,
        "pricePerUnit": item.product.price,
      })
          .toList(),
      "shippingMethod": shippingMethod,
      "paymentMethod": paymentMethod,
      "shippingPrice": shippingPrice,
      "totalPrice": totalPrice,
      "shippingAddress": {
        "name": _nameController.text,
        "email": _emailController.text,
        "phone": _phoneController.text,
        "country": _countryController.text,
        "zip": _zipController.text,
        "city": _cityController.text,
        "notes": _notesController.text,
      },
      "paymentInfo": {
        "isLegalEntity": isLegalEntity,
        "companyName": companyName,
        "registrationNr": registrationNr,
        "vatNumber": vatNumber,
        "legalAddress": legalAddress,
      }
    };

    final orderService = OrderService();
    final success = await orderService.placeOrder(context, payload: checkoutPayload);
    setState(() => loading = false);

    if (success && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Order placed successfully")),
      );
      context.go('/success');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Order failed")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final apiUrl = dotenv.env['API_URL'] ?? 'https://shop.encode.uz/api';
    final shippingPrice = shippingMethod == 'express' ? 15.0 : 5.0;
    final totalBeforeDiscount = cart.totalPrice + shippingPrice;

    return Scaffold(
      appBar: AppBar(title: const Text("Проверика")),
      body: cart.items.isEmpty
          ? const Center(child: Text("Ваша корзина пуста"))
          : SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("Контактная информация",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),

              // Name, Email, Phone
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: "Полное имя"),
                onSaved: (v) {},
                validator: (v) => v!.isEmpty ? "Требуется для заполнения" : null,
              ),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: "Электронная почта"),
                keyboardType: TextInputType.emailAddress,
                onSaved: (v) {},
                validator: (v) => v!.isEmpty ? "Требуется для заполнения" : null,
              ),
              TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(labelText: "Телефон"),
                keyboardType: TextInputType.phone,
                onSaved: (v) {},
                validator: (v) => v!.isEmpty ? "Требуется для заполнения" : null,
              ),
              const SizedBox(height: 10),

              // Legal Entity
              CheckboxListTile(
                title: const Text("Я являюсь юридическим лицом"),
                value: isLegalEntity,
                onChanged: (v) => setState(() => isLegalEntity = v!),
              ),

              if (isLegalEntity) ...[
                const SizedBox(height: 8),
                const Text("Информация о компании",
                    style: TextStyle(fontWeight: FontWeight.bold)),
                TextFormField(
                  decoration: const InputDecoration(labelText: "Название компании"),
                  initialValue: companyName,
                  onSaved: (v) => companyName = v ?? '',
                  validator: (v) => v!.isEmpty ? "Требуется для заполнения" : null,
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: "Регистрационный номер"),
                  initialValue: registrationNr,
                  onSaved: (v) => registrationNr = v ?? '',
                  validator: (v) => v!.isEmpty ? "Требуется для заполнения" : null,
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: "Номер НДС"),
                  initialValue: vatNumber,
                  onSaved: (v) => vatNumber = v ?? '',
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: "Юридический адрес"),
                  initialValue: legalAddress,
                  onSaved: (v) => legalAddress = v ?? '',
                  validator: (v) => v!.isEmpty ? "Требуется для заполнения" : null,
                ),
              ],

              const SizedBox(height: 20),
              const Text("Адрес доставки",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              TextFormField(
                controller: _countryController,
                decoration: const InputDecoration(labelText: "Страна"),
                validator: (v) => v!.isEmpty ? "Требуется для заполнения" : null,
              ),
              TextFormField(
                controller: _zipController,
                decoration: const InputDecoration(labelText: "Почтовый индекс"),
                validator: (v) => v!.isEmpty ? "Требуется для заполнения" : null,
              ),
              TextFormField(
                controller: _cityController,
                decoration: const InputDecoration(labelText: "Город"),
                validator: (v) => v!.isEmpty ? "Требуется для заполнения" : null,
              ),
              TextFormField(
                controller: _notesController,
                decoration: const InputDecoration(labelText: "Примечания к заказу"),
                maxLines: 3,
              ),

              const SizedBox(height: 20),
              const Text("Способ доставки", style: TextStyle(fontWeight: FontWeight.bold)),
              RadioListTile<String>(
                title: const Text("Стандартная доставка (\$5.00)"),
                value: 'standard',
                groupValue: shippingMethod,
                onChanged: (v) => setState(() => shippingMethod = v!),
              ),
              RadioListTile<String>(
                title: const Text("Экспресс-доставка (\$15.00)"),
                value: 'express',
                groupValue: shippingMethod,
                onChanged: (v) => setState(() => shippingMethod = v!),
              ),

              const SizedBox(height: 16),
              const Text("Способ оплаты", style: TextStyle(fontWeight: FontWeight.bold)),
              RadioListTile<String>(
                title: const Text("Кредитная/дебетовая карта"),
                value: 'card',
                groupValue: paymentMethod,
                onChanged: (v) => setState(() => paymentMethod = v!),
              ),
              RadioListTile<String>(
                title: const Text("PayPal"),
                value: 'paypal',
                groupValue: paymentMethod,
                onChanged: (v) => setState(() => paymentMethod = v!),
              ),
              RadioListTile<String>(
                title: const Text("Наложенный платеж"),
                value: 'cod',
                groupValue: paymentMethod,
                onChanged: (v) => setState(() => paymentMethod = v!),
              ),

              const SizedBox(height: 16),
              const Text("Промо-код", style: TextStyle(fontWeight: FontWeight.bold)),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _promoController,
                      decoration: const InputDecoration(hintText: "Введите промокод"),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: () => applyPromo(totalBeforeDiscount),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.black),
                    child: const Text("Применять",
                        style: TextStyle(color: Colors.white)),
                  )
                ],
              ),
              if (promoError != null)
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text(promoError!,
                      style: const TextStyle(color: Colors.red, fontSize: 13)),
                ),

              const SizedBox(height: 16),
              CheckboxListTile(
                value: agreeToTerms,
                onChanged: (v) => setState(() => agreeToTerms = v!),
                title: const Text(
                    "Я прочитал(а) и согласен(сна) с условиями использования сайта *"),
              ),

              const Divider(height: 30),

              // Summary
              const Text("Сводка заказа",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              ...cart.items.map((item) => ListTile(
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
                title: Text("${item.product.title} x${item.quantity}"),
                trailing: Text("\$${item.totalPrice.toStringAsFixed(2)}"),
              )),
              const Divider(),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Перевозки"),
                  Text("\$${shippingPrice.toStringAsFixed(2)}"),
                ],
              ),
              if (discount > 0)
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text("Скидка", style: TextStyle(color: Colors.green)),
                    Text("-\$${discount.toStringAsFixed(2)}",
                        style: const TextStyle(color: Colors.green)),
                  ],
                ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Общий", style: TextStyle(fontSize: 18)),
                  Text(
                    "\$${(totalBeforeDiscount - discount).toStringAsFixed(2)}",
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ],
              ),

              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: loading || !isLoggedIn
                    ? null
                    : () => submitOrder(context, cart),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  minimumSize: const Size(double.infinity, 50),
                ),
                child: loading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Подтвердить заказ",
                    style: TextStyle(color: Colors.white, fontSize: 16)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
