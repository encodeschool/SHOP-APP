import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../models/category_model.dart';
import '../../models/product_model.dart';
import '../../services/category_service.dart';
import '../../services/product_service.dart';
import '../../widgets/product_card.dart';


class CategoryScreen extends StatefulWidget {
  final String categoryId;
  final String categoryName;

  const CategoryScreen({
  super.key,
  required this.categoryId,
  required this.categoryName,
  });

  @override
  State<CategoryScreen> createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  final categoryService = CategoryService();
  final productService = ProductService();

  List<Category> _subcategories = [];
  List<Product> _products = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    _subcategories = await categoryService.fetchSubcategories(widget.categoryId);
    _products = await productService.fetchProductsByCategory(widget.categoryId);
    setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.categoryName)),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
        children: [
          if (_subcategories.isNotEmpty)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.all(16),
                  child: Text("Subcategories", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Wrap(
                    spacing: 10,
                    children: _subcategories
                        .map((sub) => ActionChip(
                      label: Text(sub.name),
                      onPressed: () => context.push('/category/${sub.id}', extra: sub.name),
                    ))
                        .toList(),
                  ),
                ),
                // const Divider(),
              ],
            ),
          const Padding(
            padding: EdgeInsets.all(16),
            child: Text("Products", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ),
          ..._products.map((product) => ProductCard(product: product)).toList(),
        ],
      ),
    );
  }
}
