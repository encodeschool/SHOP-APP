import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shop/l10n/app_localizations.dart';

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
  List<Product> _filteredProducts = [];

  bool _loading = true;
  bool _scrolled = false;

  final ScrollController _scrollController = ScrollController();

  // --- Filter parameters ---
  RangeValues _priceRange = const RangeValues(0, 500000);
  bool _inStockOnly = false;

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
    setState(() => _loading = true);

    try {
      _subcategories = await categoryService.fetchSubcategories(widget.categoryId);
      _products = await productService.fetchProductsByCategory(widget.categoryId);
      _filteredProducts = List.from(_products);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load data: $e')),
        );
      }
    }

    if (mounted) setState(() => _loading = false);
  }

  void _applyFilters() {
    setState(() {
      _filteredProducts = _products.where((p) {
        final priceOk = (p.price ?? 0) >= _priceRange.start && (p.price ?? 0) <= _priceRange.end;
        final stockOk = !_inStockOnly || (p.stock > 0);
        return priceOk && stockOk;
      }).toList();
    });
    Navigator.pop(context); // Close drawer after applying
  }

  void _resetFilters() {
    setState(() {
      _priceRange = const RangeValues(0, 500000);
      _inStockOnly = false;
      _filteredProducts = List.from(_products);
    });
    Navigator.pop(context);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context)!;
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

      // 🧭 Filter Drawer
      endDrawer: Drawer(
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              const Text(
                'Filters',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),

              // Price Range Filter
              const Text('Price Range'),
              RangeSlider(
                values: _priceRange,
                min: 0,
                max: 500000,
                divisions: 10,
                labels: RangeLabels(
                  _priceRange.start.toInt().toString(),
                  _priceRange.end.toInt().toString(),
                ),
                onChanged: (values) => setState(() => _priceRange = values),
              ),

              const Divider(),

              // In Stock Filter
              SwitchListTile(
                title: const Text('In Stock Only'),
                value: _inStockOnly,
                onChanged: (v) => setState(() => _inStockOnly = v),
              ),

              const Divider(),

              // Buttons
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _applyFilters,
                      style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red[900]
                      ),
                      child: const Text(
                          'Apply',
                          style: TextStyle(
                            color: Colors.white
                          ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _resetFilters,
                      child: Text(
                          'Reset',
                          style: TextStyle(
                            color: Colors.red[900]
                          ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
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
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    loc.subcategoriesTitle,
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Wrap(
                    spacing: 10,
                    children: _subcategories
                        .map((sub) => ActionChip(
                      label: Text(sub.name),
                      onPressed: () => context.push(
                          '/category/${sub.id}',
                          extra: sub.name),
                    ))
                        .toList(),
                  ),
                ),
              ],
            ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  loc.productsTitle,
                  style: const TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  icon: const Icon(Icons.filter_alt_rounded),
                  onPressed: () => Scaffold.of(context).openEndDrawer(),
                ),
              ],
            ),
          ),
          ..._filteredProducts
              .map((product) => ProductCard(product: product))
              .toList(),
        ],
      ),
    );
  }
}
