import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

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

  @override
  void initState() {
    super.initState();
    _loadUserAndCategories();
  }

  Future<void> _loadUserAndCategories() async {
    try {
      final userId = await _storage.read(key: 'userId');
      final fetchedCategories = await CategoryService().fetchCategories(); // see below

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

  bool _loading = false;

  Future<void> _pickImages() async {
    final pickedFiles = await _picker.pickMultiImage();
    if (pickedFiles.isNotEmpty) {
      setState(() => _images = pickedFiles);
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    setState(() => _loading = true);

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
        const SnackBar(content: Text("Profile added successfully")),
      );

      // Avoid popping too early and check if it's possible
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (context.mounted && context.canPop()) {
          Navigator.pop(context); // or GoRouter.of(context).pop();
        } else {
          debugPrint("Cannot pop - already at root");
        }
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error creating product: $e")),
      );
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Add Product")),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                decoration: const InputDecoration(labelText: "Title"),
                onSaved: (value) => _title = value ?? '',
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: "Price"),
                keyboardType: TextInputType.number,
                onSaved: (value) => _price = double.tryParse(value ?? '0') ?? 0,
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: "Stock"),
                keyboardType: TextInputType.number,
                onSaved: (value) => _stock = int.tryParse(value ?? '0') ?? 0,
              ),
              DropdownButtonFormField<String>(
                value: _condition,
                decoration: const InputDecoration(labelText: "Condition"),
                items: const [
                  DropdownMenuItem(value: 'NEW', child: Text('New')),
                  DropdownMenuItem(value: 'USED', child: Text('Used')),
                ],
                onChanged: (val) => setState(() => _condition = val ?? 'NEW'),
              ),
              DropdownButtonFormField<String>(
                value: _selectedCategoryId,
                decoration: const InputDecoration(labelText: "Category"),
                items: _categories.map((category) {
                  return DropdownMenuItem<String>(
                    value: category['id'],
                    child: Text(category['name']),
                  );
                }).toList(),
                onChanged: (val) => setState(() => _selectedCategoryId = val),
                validator: (value) => value == null ? 'Category required' : null,
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: "Description"),
                maxLines: 3,
                onSaved: (value) => _description = value ?? '',
              ),
              SwitchListTile(
                value: _featured,
                onChanged: (val) => setState(() => _featured = val),
                title: const Text("Featured"),
              ),
              SwitchListTile(
                value: _available,
                onChanged: (val) => setState(() => _available = val),
                title: const Text("Available"),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _pickImages,
                icon: const Icon(Icons.image),
                label: Text("Select Images (${_images.length})"),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _submit,
                child: const Text("Create Product"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
