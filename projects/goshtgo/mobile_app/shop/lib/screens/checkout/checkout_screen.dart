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
import 'dart:ui' as ui; // Add this at top

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _promoController = TextEditingController();
  final storage = const FlutterSecureStorage();

  // Controllers for user data
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

    _countryController.text = _countryController.text.isNotEmpty
        ? _countryController.text
        : ui.window.locale.countryCode ?? '';

    if (token == null || userId == null) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(AppLocalizations.of(context)!.loginRequired)),
        );
        context.go('/login?redirect=/checkout');
      }
      return;
    }

    setState(() => isLoggedIn = true);

    final user = await _loadUser();
    if (user != null && mounted) {
      _nameController.text = user.name;
      _emailController.text = user.email;
      _phoneController.text = user.phone ?? '';
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
        promoError = AppLocalizations.of(context)!.invalidPromo;
        discount = 0;
      });
    }
  }

  Future<void> submitOrder(BuildContext context, CartProvider cart) async {
    if (!_formKey.currentState!.validate()) return;
    if (!agreeToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppLocalizations.of(context)!.termsRequired)),
      );
      return;
    }

    if (userId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppLocalizations.of(context)!.userNotFound)),
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
        SnackBar(content: Text(AppLocalizations.of(context)!.orderSuccess)),
      );
      context.go('/success');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppLocalizations.of(context)!.orderFailed)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context)!;
    final cart = context.watch<CartProvider>();
    final apiUrl = dotenv.env['API_URL'] ?? 'https://shop.encode.uz/api';
    final shippingPrice = shippingMethod == 'express' ? 15.0 : 5.0;
    final totalBeforeDiscount = cart.totalPrice + shippingPrice;

    return Scaffold(
      appBar: AppBar(title: Text(loc.checkoutTitle)),
      body: cart.items.isEmpty
          ? Center(child: Text(loc.cartEmpty))
          : SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(loc.contactInfo, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(labelText: loc.fullName),
                validator: (v) => v!.isEmpty ? loc.fullName : null,
              ),
              TextFormField(
                controller: _emailController,
                decoration: InputDecoration(labelText: loc.email),
                keyboardType: TextInputType.emailAddress,
                validator: (v) => v!.isEmpty ? loc.email : null,
              ),
              TextFormField(
                controller: _phoneController,
                decoration: InputDecoration(labelText: loc.phone),
                keyboardType: TextInputType.phone,
                validator: (v) => v!.isEmpty ? loc.phone : null,
              ),
              const SizedBox(height: 10),
              CheckboxListTile(
                title: Text(loc.legalEntity),
                value: isLegalEntity,
                onChanged: (v) => setState(() => isLegalEntity = v!),
              ),
              if (isLegalEntity) ...[
                const SizedBox(height: 8),
                Text(loc.companyInfo, style: const TextStyle(fontWeight: FontWeight.bold)),
                TextFormField(
                  decoration: InputDecoration(labelText: loc.companyName),
                  initialValue: companyName,
                  onSaved: (v) => companyName = v ?? '',
                  validator: (v) => v!.isEmpty ? loc.companyName : null,
                ),
                TextFormField(
                  decoration: InputDecoration(labelText: loc.registrationNr),
                  initialValue: registrationNr,
                  onSaved: (v) => registrationNr = v ?? '',
                  validator: (v) => v!.isEmpty ? loc.registrationNr : null,
                ),
                TextFormField(
                  decoration: InputDecoration(labelText: loc.vatNumber),
                  initialValue: vatNumber,
                  onSaved: (v) => vatNumber = v ?? '',
                ),
                TextFormField(
                  decoration: InputDecoration(labelText: loc.legalAddress),
                  initialValue: legalAddress,
                  onSaved: (v) => legalAddress = v ?? '',
                  validator: (v) => v!.isEmpty ? loc.legalAddress : null,
                ),
              ],
              const SizedBox(height: 20),
              Text(loc.shippingAddress, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              GestureDetector(
                onTap: () {
                  showCountryPicker(
                    context: context,
                    showPhoneCode: false, // set to true if you want to show calling codes
                    onSelect: (Country country) {
                      setState(() {
                        _countryController.text = country.name;
                      });
                    },
                  );
                },
                child: AbsorbPointer(
                  child: TextFormField(
                    controller: _countryController,
                    decoration: InputDecoration(
                      labelText: loc.country,
                      suffixIcon: const Icon(Icons.arrow_drop_down),
                    ),
                    validator: (v) => v!.isEmpty ? loc.country : null,
                  ),
                ),
              ),
              TextFormField(controller: _zipController, decoration: InputDecoration(labelText: loc.zipCode), validator: (v) => v!.isEmpty ? loc.zipCode : null),
              TextFormField(controller: _cityController, decoration: InputDecoration(labelText: loc.city), validator: (v) => v!.isEmpty ? loc.city : null),
              TextFormField(controller: _notesController, decoration: InputDecoration(labelText: loc.notes), maxLines: 3),
              const SizedBox(height: 20),
              Text(loc.shippingMethod, style: const TextStyle(fontWeight: FontWeight.bold)),
              RadioListTile<String>(title: Text(loc.standardShipping), value: 'standard', groupValue: shippingMethod, onChanged: (v) => setState(() => shippingMethod = v!)),
              RadioListTile<String>(title: Text(loc.expressShipping), value: 'express', groupValue: shippingMethod, onChanged: (v) => setState(() => shippingMethod = v!)),
              const SizedBox(height: 16),
              Text(loc.paymentMethod, style: const TextStyle(fontWeight: FontWeight.bold)),
              RadioListTile<String>(title: Text(loc.cardPayment), value: 'card', groupValue: paymentMethod, onChanged: (v) => setState(() => paymentMethod = v!)),
              RadioListTile<String>(title: Text(loc.paypalPayment), value: 'paypal', groupValue: paymentMethod, onChanged: (v) => setState(() => paymentMethod = v!)),
              RadioListTile<String>(title: Text(loc.codPayment), value: 'cod', groupValue: paymentMethod, onChanged: (v) => setState(() => paymentMethod = v!)),
              const SizedBox(height: 16),
              Text(loc.promoCode, style: const TextStyle(fontWeight: FontWeight.bold)),
              Row(
                children: [
                  Expanded(child: TextField(controller: _promoController, decoration: InputDecoration(hintText: loc.promoCode))),
                  const SizedBox(width: 8),
                  ElevatedButton(onPressed: () => applyPromo(totalBeforeDiscount), style: ElevatedButton.styleFrom(backgroundColor: Colors.black), child: Text(loc.apply, style: const TextStyle(color: Colors.white))),
                ],
              ),
              if (promoError != null) Padding(padding: const EdgeInsets.only(top: 4), child: Text(promoError!, style: const TextStyle(color: Colors.red, fontSize: 13))),
              const SizedBox(height: 16),
              CheckboxListTile(value: agreeToTerms, onChanged: (v) => setState(() => agreeToTerms = v!), title: Text(loc.acceptTerms)),
              const Divider(height: 30),
              Text(loc.orderSummary, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              ...cart.items.map((item) => ListTile(
                leading: item.product.images.isNotEmpty ? Image.network('$apiUrl${item.product.images[0]}', width: 50, height: 50, fit: BoxFit.cover, errorBuilder: (context, error, stackTrace) => const Icon(Icons.broken_image)) : const Icon(Icons.image, size: 50),
                title: Text("${item.product.title} x${item.quantity}"),
                trailing: Text("\$${item.totalPrice.toStringAsFixed(2)}"),
              )),
              const Divider(),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text(loc.shipping), Text("\$${shippingPrice.toStringAsFixed(2)}")]),
              if (discount > 0) Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text(loc.discount, style: const TextStyle(color: Colors.green)), Text("-\$${discount.toStringAsFixed(2)}", style: const TextStyle(color: Colors.green))]),
              const SizedBox(height: 8),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text(loc.total, style: const TextStyle(fontSize: 18)), Text("\$${(totalBeforeDiscount - discount).toStringAsFixed(2)}", style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold))]),
              const SizedBox(height: 20),
              ElevatedButton(onPressed: loading || !isLoggedIn ? null : () => submitOrder(context, cart), style: ElevatedButton.styleFrom(backgroundColor: Colors.black, minimumSize: const Size(double.infinity, 50)), child: loading ? const CircularProgressIndicator(color: Colors.white) : Text(loc.placeOrder, style: const TextStyle(color: Colors.white, fontSize: 16))),
            ],
          ),
        ),
      ),
    );
  }
}
