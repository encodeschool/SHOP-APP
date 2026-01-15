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
        final loc = AppLocalizations.of(context)!;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(loc.failedToLoadData),
            backgroundColor: Colors.red[700],
            behavior: SnackBarBehavior.floating,
          ),
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
    Navigator.pop(context);
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
    final lightRed = Colors.red[50];

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: AnimatedDefaultTextStyle(
          duration: const Duration(milliseconds: 250),
          style: TextStyle(
            color: _scrolled ? Colors.white : Colors.black,
            fontWeight: FontWeight.w600,
            fontSize: 20,
          ),
          child: Text(widget.categoryName),
        ),
        backgroundColor: _scrolled ? redColor : Colors.white,
        elevation: _scrolled ? 4 : 0,
        iconTheme: IconThemeData(
          color: _scrolled ? Colors.white : Colors.black,
        ),
        actions: [
          Builder(
            builder: (context) => Container(
              margin: const EdgeInsets.only(right: 8),
              decoration: BoxDecoration(
                color: _scrolled ? Colors.white.withOpacity(0.2) : lightRed,
                borderRadius: BorderRadius.circular(12),
              ),
              child: IconButton(
                icon: Icon(
                  Icons.filter_list_rounded,
                  color: _scrolled ? Colors.white : redColor,
                ),
                onPressed: () => Scaffold.of(context).openEndDrawer(),
              ),
            ),
          ),
        ],
        centerTitle: false,
      ),

      endDrawer: Drawer(
        width: MediaQuery.of(context).size.width * 0.85,
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Colors.white, Colors.grey[50]!],
            ),
          ),
          child: SafeArea(
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 20),
                  child: Row(
                    children: [
                      Icon(Icons.tune_rounded, color: redColor, size: 28),
                      const SizedBox(width: 12),
                      Text(
                        loc.filters,
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: redColor,
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        icon: Icon(Icons.close, color: redColor),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                ),

                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(20),
                    children: [
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.attach_money_rounded, color: redColor, size: 22),
                                const SizedBox(width: 8),
                                Text(
                                  loc.priceRange,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 8,
                                  ),
                                  decoration: BoxDecoration(
                                    color: lightRed,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    '${_priceRange.start.toInt()}',
                                    style: TextStyle(
                                      color: redColor,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                Text(
                                  loc.to,
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 8,
                                  ),
                                  decoration: BoxDecoration(
                                    color: lightRed,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    '${_priceRange.end.toInt()}',
                                    style: TextStyle(
                                      color: redColor,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            SliderTheme(
                              data: SliderThemeData(
                                activeTrackColor: redColor,
                                inactiveTrackColor: Colors.grey[300],
                                thumbColor: redColor,
                                overlayColor: redColor?.withOpacity(0.2),
                                valueIndicatorColor: redColor,
                              ),
                              child: RangeSlider(
                                values: _priceRange,
                                min: 0,
                                max: 500000,
                                divisions: 10,
                                labels: RangeLabels(
                                  '${_priceRange.start.toInt()}',
                                  '${_priceRange.end.toInt()}',
                                ),
                                onChanged: (values) => setState(() => _priceRange = values),
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 16),

                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: SwitchListTile(
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          title: Row(
                            children: [
                              Icon(Icons.inventory_2_rounded, color: redColor, size: 22),
                              const SizedBox(width: 8),
                              Text(
                                loc.inStockOnly,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                          value: _inStockOnly,
                          activeColor: redColor,
                          onChanged: (v) => setState(() => _inStockOnly = v),
                        ),
                      ),

                      const SizedBox(height: 24),

                      if (_inStockOnly || _priceRange != const RangeValues(0, 500000))
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: lightRed,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: redColor!.withOpacity(0.3)),
                          ),
                          child: Row(
                            children: [
                              Icon(Icons.info_outline_rounded, color: redColor, size: 20),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  loc.activeFiltersApplied,
                                  style: TextStyle(
                                    color: redColor,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),

                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 10,
                        offset: const Offset(0, -4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: _resetFilters,
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            side: BorderSide(color: redColor!, width: 2),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: Text(
                            loc.reset,
                            style: TextStyle(
                              color: redColor,
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        flex: 2,
                        child: ElevatedButton(
                          onPressed: _applyFilters,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: redColor,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 2,
                          ),
                          child: Text(
                            loc.applyFilters,
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),

      body: _loading
          ? Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: redColor),
            const SizedBox(height: 16),
            Text(
              loc.loadingProducts,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 14,
              ),
            ),
          ],
        ),
      )
          : RefreshIndicator(
        color: redColor,
        onRefresh: _load,
        child: ListView(
          controller: _scrollController,
          padding: const EdgeInsets.only(bottom: 16),
          children: [
            if (_subcategories.isNotEmpty)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                    child: Row(
                      children: [
                        Icon(Icons.category_rounded, color: redColor, size: 22),
                        const SizedBox(width: 8),
                        Text(
                          loc.subcategoriesTitle,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(
                    height: 50,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: _subcategories.length,
                      itemBuilder: (context, index) {
                        final sub = _subcategories[index];
                        return Container(
                          margin: const EdgeInsets.only(right: 8),
                          child: Material(
                            color: lightRed,
                            borderRadius: BorderRadius.circular(25),
                            elevation: 2,
                            shadowColor: Colors.black.withOpacity(0.1),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(25),
                              onTap: () => context.push(
                                '/category/${sub.id}',
                                extra: sub.name,
                              ),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 20,
                                  vertical: 12,
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      sub.name,
                                      style: TextStyle(
                                        color: redColor,
                                        fontWeight: FontWeight.w600,
                                        fontSize: 14,
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    Icon(
                                      Icons.arrow_forward_ios_rounded,
                                      size: 12,
                                      color: redColor,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 8),
                ],
              ),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  Icon(Icons.shopping_bag_rounded, color: redColor, size: 22),
                  const SizedBox(width: 8),
                  Text(
                    loc.productsTitle,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: redColor,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${_filteredProducts.length}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            if (_filteredProducts.isEmpty)
              Container(
                margin: const EdgeInsets.all(32),
                child: Column(
                  children: [
                    Icon(
                      Icons.shopping_bag_outlined,
                      size: 80,
                      color: Colors.grey[300],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      loc.noProductsFound,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      loc.tryAdjustingFilters,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[500],
                      ),
                    ),
                  ],
                ),
              )
            else
              ..._filteredProducts
                  .map((product) => Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 8,
                  vertical: 6,
                ),
                child: ProductCard(product: product),
              ))
                  .toList(),
          ],
        ),
      ),
    );
  }
}
