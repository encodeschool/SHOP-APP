import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shop/l10n/app_localizations.dart';
import '../../core/cart_provider.dart';
import '../../models/user_model.dart';
import '../../services/order_service.dart';
import 'package:go_router/go_router.dart';
import '../../services/user_service.dart';
import 'package:country_picker/country_picker.dart';
import 'dart:ui' as ui;

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final storage = const FlutterSecureStorage();

  Country? _selectedCountry;

  final _promoController = TextEditingController();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _countryController = TextEditingController();
  final _zipController = TextEditingController();
  final _cityController = TextEditingController();
  final _notesController = TextEditingController();

  bool isLegalEntity = false;
  bool agreeToTerms = false;
  bool loading = false;

  String shippingMethod = 'standard';
  String paymentMethod = 'cod';

  double discount = 0;
  String? promoError;

  String? userId;
  bool isLoggedIn = false;

  String companyName = '';
  String registrationNr = '';
  String vatNumber = '';
  String legalAddress = '';

  @override
  void initState() {
    super.initState();
    _initUser();
  }

  Future<void> _initUser() async {
    final token = await storage.read(key: 'token');
    userId = await storage.read(key: 'userId');

    _countryController.text = ui.window.locale.countryCode ?? '';

    if (token == null || userId == null) {
      if (mounted) {
        context.go('/login?redirect=/checkout');
      }
      return;
    }

    isLoggedIn = true;
    final user = await UserService().getUserDetails();

    if (user != null && mounted) {
      _nameController.text = user.name;
      _emailController.text = user.email;
      _phoneController.text = user.phone ?? '';
    }
  }

  Future<void> applyPromo(double total) async {
    setState(() => promoError = null);
    try {
      final response = await OrderService().applyPromo(_promoController.text, total);
      setState(() => discount = total - response['newTotal']);
    } catch (_) {
      setState(() {
        promoError = AppLocalizations.of(context)!.invalidPromo;
        discount = 0;
      });
    }
  }

  Future<void> submitOrder(CartProvider cart) async {
    final loc = AppLocalizations.of(context)!;

    if (!_formKey.currentState!.validate()) return;
    if (!agreeToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(loc.termsRequired)));
      return;
    }

    setState(() => loading = true);

    final shippingPrice = shippingMethod == 'express' ? 15.0 : 5.0;
    final totalPrice = cart.totalPrice + shippingPrice - discount;

    final payload = {
      "userId": userId,
      "items": cart.items.map((i) => {
        "productId": i.product.id,
        "quantity": i.quantity,
        "pricePerUnit": i.product.price,
      }).toList(),
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

    final success = await OrderService().placeOrder(context, payload: payload);
    setState(() => loading = false);

    if (success && mounted) {
      context.go('/success');
    }
  }

  Widget _card({required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: child,
    );
  }

  Widget _title(String text, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: Colors.red[900]),
        const SizedBox(width: 8),
        Text(text, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context)!;
    final cart = context.watch<CartProvider>();
    final apiUrl = dotenv.env['API_URL'] ?? '';

    final shippingPrice = shippingMethod == 'express' ? 15.0 : 5.0;
    final total = cart.totalPrice + shippingPrice - discount;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      appBar: AppBar(title: Text(loc.checkoutTitle)),
      body: cart.items.isEmpty
          ? Center(child: Text(loc.cartEmpty))
          : SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [

              /// CONTACT
              _card(
                child: Column(
                  children: [
                    _title(loc.contactInfo, Icons.person_outline),
                    const SizedBox(height: 16),
                    TextFormField(controller: _nameController, decoration: InputDecoration(labelText: loc.fullName), validator: (v) => v!.isEmpty ? loc.fullName : null),
                    const SizedBox(height: 12),
                    TextFormField(controller: _emailController, decoration: InputDecoration(labelText: loc.email)),
                    const SizedBox(height: 12),
                    TextFormField(controller: _phoneController, decoration: InputDecoration(labelText: loc.phone)),
                  ],
                ),
              ),

              /// SHIPPING ADDRESS
              _card(
                child: Column(
                  children: [
                    _title(loc.shippingAddress, Icons.local_shipping_outlined),
                    const SizedBox(height: 16),
                    GestureDetector(
                      onTap: () {
                        showCountryPicker(
                          context: context,
                          onSelect: (c) {
                            _selectedCountry = c;
                            _countryController.text = c.name;
                            setState(() {});
                          },
                        );
                      },
                      child: AbsorbPointer(
                        child: TextFormField(
                          controller: _countryController,
                          decoration: const InputDecoration(labelText: 'Country'),
                          validator: (v) => v!.isEmpty ? 'Country required' : null,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextFormField(controller: _zipController, decoration: InputDecoration(labelText: loc.zipCode)),
                    const SizedBox(height: 12),
                    TextFormField(controller: _cityController, decoration: InputDecoration(labelText: loc.city)),
                    const SizedBox(height: 12),
                    TextFormField(controller: _notesController, decoration: InputDecoration(labelText: loc.notes), maxLines: 3),
                  ],
                ),
              ),

              /// SHIPPING METHOD
              _card(
                child: Column(
                  children: [
                    _title(loc.shippingMethod, Icons.delivery_dining),
                    RadioListTile(value: 'standard', groupValue: shippingMethod, title: Text(loc.standardShipping), onChanged: (v) => setState(() => shippingMethod = v!)),
                    RadioListTile(value: 'express', groupValue: shippingMethod, title: Text(loc.expressShipping), onChanged: (v) => setState(() => shippingMethod = v!)),
                  ],
                ),
              ),

              /// PAYMENT
              _card(
                child: Column(
                  children: [
                    _title(loc.paymentMethod, Icons.payment),
                    RadioListTile(value: 'cod', groupValue: paymentMethod, title: Text(loc.codPayment), onChanged: (v) => setState(() => paymentMethod = v!)),
                  ],
                ),
              ),

              /// PROMO
              _card(
                child: Column(
                  children: [
                    _title(loc.promoCode, Icons.discount),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(child: TextField(controller: _promoController)),
                        const SizedBox(width: 8),
                        ElevatedButton(onPressed: () => applyPromo(cart.totalPrice + shippingPrice), child: Text(loc.apply)),
                      ],
                    ),
                    if (promoError != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 6),
                        child: Text(promoError!, style: const TextStyle(color: Colors.red)),
                      ),
                  ],
                ),
              ),

              /// SUMMARY
              _card(
                child: Column(
                  children: [
                    _title(loc.orderSummary, Icons.receipt_long),
                    const SizedBox(height: 12),
                    ...cart.items.map((i) => ListTile(
                      leading: Image.network('$apiUrl${i.product.images.first}', width: 40, errorBuilder: (_, __, ___) => const Icon(Icons.image)),
                      title: Text('${i.product.title} x${i.quantity}'),
                      trailing: Text(i.totalPrice.toStringAsFixed(2)),
                    )),
                    const Divider(),
                    _row(loc.shipping, shippingPrice),
                    if (discount > 0) _row(loc.discount, -discount, green: true),
                    const Divider(),
                    _row(loc.total, total, bold: true),
                  ],
                ),
              ),

              CheckboxListTile(
                value: agreeToTerms,
                onChanged: (v) => setState(() => agreeToTerms = v!),
                title: Text(loc.acceptTerms),
              ),

              const SizedBox(height: 10),
              ElevatedButton(
                onPressed: loading ? null : () => submitOrder(cart),
                style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
                child: loading ? const CircularProgressIndicator(color: Colors.white) : Text(loc.placeOrder),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _row(String label, double value, {bool bold = false, bool green = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label),
        Text(
          value.toStringAsFixed(2),
          style: TextStyle(
            fontWeight: bold ? FontWeight.bold : FontWeight.normal,
            color: green ? Colors.green : null,
          ),
        ),
      ],
    );
  }
}
