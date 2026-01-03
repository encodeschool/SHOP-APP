import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:enroute/l10n/app_localizations.dart';

import '../../services/category_service.dart';
import '../../services/product_service.dart';

class ProductAddScreen extends StatefulWidget {
  const ProductAddScreen({super.key});

  @override
  State<ProductAddScreen> createState() => _ProductAddScreenState();
}

class _ProductAddScreenState extends State<ProductAddScreen> {
  final _formKey = GlobalKey<FormState>();
  final ImagePicker _picker = ImagePicker();

  String _title = '';
  String _description = '';
  double _price = 0;
  int _stock = 0;
  bool _featured = false;
  bool _available = true;
  String _condition = 'NEW';
  List<XFile> _images = [];
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  List<Map<String, dynamic>> _categories = [];
  String? _selectedCategoryId;
  String? _userId;

  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _loadUserAndCategories();
  }

  Future<void> _loadUserAndCategories() async {
    try {
      final userId = await _storage.read(key: 'userId');
      final fetchedCategories = await CategoryService().fetchCategories();

      setState(() {
        _userId = userId;
        _categories = fetchedCategories;
        if (_categories.isNotEmpty) {
          _selectedCategoryId = _categories.first['id'];
        }
      });
    } catch (e) {
      debugPrint("Failed to load user or categories: $e");
    }
  }

  Future<void> _pickImages() async {
    final pickedFiles = await _picker.pickMultiImage();
    if (pickedFiles.isNotEmpty) setState(() => _images = pickedFiles);
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    setState(() => _loading = true);
    final loc = AppLocalizations.of(context)!;

    final productJson = {
      "title": _title,
      "description": _description,
      "price": _price,
      "quantity": _stock,
      "available": _available,
      "stock": _stock,
      "condition": _condition,
      "featured": _featured,
      "categoryId": _selectedCategoryId,
      "userId": _userId,
    };

    try {
      await ProductService().createProduct(
        productData: productJson,
        images: _images,
      );
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(loc.productCreated)),
      );

      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (context.mounted && context.canPop()) {
          Navigator.pop(context);
        }
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("${loc.productCreateError}: $e")),
      );
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(title: Text(loc.addProductTitle)),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                decoration: InputDecoration(labelText: loc.titleLabel),
                onSaved: (val) => _title = val ?? '',
                validator: (val) =>
                val == null || val.isEmpty ? loc.requiredField : null,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: loc.priceLabel),
                keyboardType: TextInputType.number,
                onSaved: (val) =>
                _price = double.tryParse(val ?? '0') ?? 0,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: loc.stockLabel),
                keyboardType: TextInputType.number,
                onSaved: (val) => _stock = int.tryParse(val ?? '0') ?? 0,
              ),
              DropdownButtonFormField<String>(
                value: _condition,
                decoration: InputDecoration(labelText: loc.conditionLabel),
                items: [
                  DropdownMenuItem(
                      value: 'NEW', child: Text(loc.conditionNew)),
                  DropdownMenuItem(
                      value: 'USED', child: Text(loc.conditionUsed)),
                ],
                onChanged: (val) => setState(() => _condition = val ?? 'NEW'),
              ),
              DropdownButtonFormField<String>(
                value: _selectedCategoryId,
                decoration: InputDecoration(labelText: loc.categoryLabel),
                items: _categories
                    .map((cat) => DropdownMenuItem<String>(
                  value: cat['id'],
                  child: Text(cat['name']),
                ))
                    .toList(),
                onChanged: (val) => setState(() => _selectedCategoryId = val),
                validator: (val) =>
                val == null ? loc.categoryRequired : null,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: loc.descriptionLabel),
                maxLines: 3,
                onSaved: (val) => _description = val ?? '',
              ),
              SwitchListTile(
                value: _featured,
                onChanged: (val) => setState(() => _featured = val),
                title: Text(loc.featuredLabel),
              ),
              SwitchListTile(
                value: _available,
                onChanged: (val) => setState(() => _available = val),
                title: Text(loc.availableLabel),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _pickImages,
                icon: const Icon(Icons.image),
                label: Text(loc.selectImages(_images.length)),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _submit,
                child: Text(loc.createProduct),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
