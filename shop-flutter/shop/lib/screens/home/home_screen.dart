import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../models/category_model.dart';
import '../../models/product_model.dart';
import '../../models/user_model.dart';
import '../../services/category_service.dart';
import '../../services/product_service.dart';
import '../../services/user_service.dart';
import '../../widgets/category_tile.dart';
import '../../widgets/product_card.dart';
import '../../widgets/product_tile.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final categoryService = CategoryService();
  final productService = ProductService();
  final userService = UserService();

  List<Category> _categories = [];
  List<Product> _products = [];
  List<Product> _all_products = [];
  Product? searchedProduct;
  User? _user;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    try {
      _categories = await categoryService.fetchRootCategories();
      _products = await productService.fetchFeaturedProducts();
      _all_products = await productService.fetchAllProducts();
      _user = await userService.getUserDetails();

      if (!mounted) return; // Prevent memory leak

    } catch (e) {
      print('Error loading data: $e');
      // Optionally show a snackbar or error message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load data: $e')),
        );
      }
    }
    setState(() => _loading = false);
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        // title: const Text("E-Commerce"),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () => context.push('/cart'),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
        onRefresh: _loadData,
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Find Your Best Product',
                      style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.orange
                      )
                    ),
                    Text(
                        'The marketplace of products you add or you get',
                        style: TextStyle(
                            color: Colors.grey[450]
                        )
                    ),
                  ],
                )
              )
            ),
            SliverToBoxAdapter(
                child: Padding(
                    padding: const EdgeInsets.only(left: 16, right: 16),
                    child: Container(
                      decoration: BoxDecoration(
                          border: Border(
                            top: BorderSide(width: 2.0, color: Colors.orange),
                            bottom: BorderSide(width: 2.0, color: Colors.orange),
                            right: BorderSide(width: 2.0, color: Colors.orange),
                            left: BorderSide(width: 2.0, color: Colors.orange),
                          ),
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                      ),
                      padding: EdgeInsets.all(16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Icon(Icons.search),
                          const SizedBox(width: 8),
                          Expanded(
                            child: TextField(
                              decoration: const InputDecoration(
                                hintText: 'Search products...',
                                border: InputBorder.none,
                                isDense: true, // reduces height
                              ),
                              onChanged: (value) {
                              },
                            ),
                          ),
                          if (_loading) const CircularProgressIndicator(),
                        ]
                      )
                    )
                )
            ),
            if (searchedProduct != null)
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Product Found: ${searchedProduct!.title}', style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(searchedProduct!.description),
                  ],
                ),
              ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  "Categories",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: SizedBox(
                height: 140,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: _categories.length,
                  itemBuilder: (context, index) {
                    final category = _categories[index];
                    return CategoryTile(category: category);
                  },
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.only(left: 16, right: 16),
                child: Text(
                  "Featured Products",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            SliverList(
              delegate: SliverChildBuilderDelegate(
                    (context, index) {
                  final product = _products[index];
                  return ProductCard(product: product);
                },
                childCount: _products.length,
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'All Products',
                  style: TextStyle(fontSize:18, fontWeight: FontWeight.bold)
                )
              )
            ),
            SliverPadding(
              padding: const EdgeInsets.all(8),
              sliver: SliverGrid(
                delegate: SliverChildBuilderDelegate(
                      (context, index) {
                    return ProductTile(product: _all_products[index]);
                  },
                  childCount: _all_products.length,
                ),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 8,
                  crossAxisSpacing: 8,
                  childAspectRatio: 0.7,
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}