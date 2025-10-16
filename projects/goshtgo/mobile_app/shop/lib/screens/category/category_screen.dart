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

  final ScrollController _scrollController = ScrollController();
  bool _scrolled = false;

  @override
  void initState() {
    super.initState();
    _load();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.offset > 50 && !_scrolled) {
      setState(() => _scrolled = true);
    } else if (_scrollController.offset <= 50 && _scrolled) {
      setState(() => _scrolled = false);
    }
  }

  Future<void> _load() async {
    _subcategories = await categoryService.fetchSubcategories(widget.categoryId);
    _products = await productService.fetchProductsByCategory(widget.categoryId);
    setState(() => _loading = false);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final redColor = Colors.red[900];

    return Scaffold(
      appBar: AppBar(
        title: AnimatedDefaultTextStyle(
          duration: const Duration(milliseconds: 250),
          style: TextStyle(
            color: _scrolled ? Colors.white : Colors.black,
            fontWeight: FontWeight.w600,
            fontSize: 18,
          ),
          child: Text(widget.categoryName),
        ),
        backgroundColor: _scrolled ? redColor : Colors.white,
        elevation: _scrolled ? 4 : 0,
        iconTheme: IconThemeData(
          color: _scrolled ? Colors.white : Colors.black,
        ),
        centerTitle: false,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
        controller: _scrollController,
        children: [
          if (_subcategories.isNotEmpty)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.all(16),
                  child: Text("Под категории", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
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
            child: Text("Продукции", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ),
          ..._products.map((product) => ProductCard(product: product)).toList(),
        ],
      ),
    );
  }
}
