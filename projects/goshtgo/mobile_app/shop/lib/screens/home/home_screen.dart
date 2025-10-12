import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../core/cart_provider.dart';
import '../../models/category_model.dart';
import '../../models/product_model.dart';
import '../../models/user_model.dart';
import '../../services/category_service.dart';
import '../../services/product_service.dart';
import '../../services/user_service.dart';
import '../../widgets/category_section.dart';
import '../../widgets/category_tile.dart';
import '../../widgets/product_card.dart';
import '../../widgets/product_tile.dart';
import 'package:flutter_svg/flutter_svg.dart';

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

  int _visibleTopCount = 4; // initial visible "Топ мясо"
  int _visibleAllCount = 6; // initial visible "Все продукции"
  Map<String, List<Product>> _productsByCategory = {};

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

      // Group products by category
      _productsByCategory = {};
      for (var product in _all_products) {
        if (!_productsByCategory.containsKey(product.categoryId)) {
          _productsByCategory[product.categoryId] = [];
        }
        _productsByCategory[product.categoryId]!.add(product);
      }

      if (!mounted) return;
    } catch (e) {
      print('Error loading data: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load data: $e')),
        );
      }
    }
    setState(() => _loading = false);
  }

  Category? findSubcategoryByCode(String code) {
    if (code.isEmpty || _categories.isEmpty) return null;
    final lower = code.toLowerCase();

    Category? searchNode(Category? node) {
      if (node == null) return null;
      if (node.categoryCode != null && node.categoryCode!.toLowerCase().contains(lower)) {
        return node;
      }
      if (node.subcategories != null && node.subcategories!.isNotEmpty) {
        for (var sub in node.subcategories!) {
          final found = searchNode(sub);
          if (found != null) return found;
        }
      }
      return null;
    }

    for (var root in _categories) {
      final found = searchNode(root);
      if (found != null) return found;
    }
    return null;
  }


  void _loadMoreTop() {
    setState(() {
      _visibleTopCount = (_visibleTopCount + 4).clamp(0, _products.length);
    });
  }

  void _loadMoreAll() {
    setState(() {
      _visibleAllCount = (_visibleAllCount + 6).clamp(0, _all_products.length);
    });
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Colors.red[900];
    final beefCategory = findSubcategoryByCode('beef');
    final chickenCategory = findSubcategoryByCode('chicken');
    final marbledBeef = findSubcategoryByCode('marbled');
    final rabbitCategory = findSubcategoryByCode('rabbit');

    return Scaffold(
      // appBar: AppBar(
      //   // title: const Text("E-Commerce"),
      //   actions: [
      //     IconButton(
      //       icon: const Icon(Icons.shopping_cart),
      //       onPressed: () => context.push('/cart'),
      //     ),
      //   ],
      // ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            SizedBox(height: 25),
            // DrawerHeader(
            //   decoration: BoxDecoration(
            //     color: primaryColor,
            //   ),
            //   child: Text(
            //     'Menu',
            //     style: TextStyle(color: Colors.white, fontSize: 24),
            //   ),
            // ),
            SizedBox(height: 25),
            ListTile(
              leading: Icon(Icons.home),
              title: Text('О нас'),
              onTap: () {
                Navigator.pop(context);
                context.go('/about');
              }
            ),
            ListTile(
              leading: Icon(Icons.delivery_dining),
              title: Text('Доставка'),
              onTap: () {
                Navigator.pop(context);
                context.go('/delivery');
              }
            ),
            ListTile(
              leading: Icon(Icons.high_quality),
              title: Text('Качество'),
              onTap: () {
                Navigator.pop(context);
                context.go('/quality');
              }
            ),
            ListTile(
              leading: Icon(Icons.support),
              title: Text('Контакты'),
              onTap: () {
                Navigator.pop(context);
                context.go('/contact');
              }
            ),
          ],
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
        onRefresh: _loadData,
        color: primaryColor,
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 50),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        SvgPicture.asset(
                          'assets/logo/logo.svg',
                          width: 50,
                          height: 50,
                          // placeholderBuilder: (context) => const CircularProgressIndicator(),
                        ),
                        Builder(
                          builder: (context) => IconButton(
                            icon: const Icon(Icons.menu, size: 32),
                            onPressed: () {
                              Scaffold.of(context).openDrawer();
                            },
                          ),
                        ),
                      ]
                    ),
                    const SizedBox(height: 15),
                    Text(
                      'Мясо нового поколения',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: primaryColor,
                      ),
                    ),
                    Text(
                      'Для нас мясо — это чистота, уважение и доверие.',
                      style: TextStyle(
                        color: primaryColor?.withOpacity(0.6),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: primaryColor!, width: 2),
                    borderRadius: const BorderRadius.all(Radius.circular(10)),
                  ),
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Icon(Icons.search, color: primaryColor),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextField(
                          decoration: const InputDecoration(
                            hintText: 'Поиск продукции...',
                            border: InputBorder.none,
                            isDense: true,
                          ),
                          onChanged: (value) {},
                        ),
                      ),
                      if (_loading)
                        CircularProgressIndicator(color: primaryColor),
                    ],
                  ),
                ),
              ),
            ),
            if (searchedProduct != null)
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Найденные продукты: ${searchedProduct!.title}',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: primaryColor,
                      ),
                    ),
                    Text(searchedProduct!.description),
                  ],
                ),
              ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  "Категории",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: primaryColor,
                  ),
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
            // Products by category
            SliverToBoxAdapter(
              child: Column(
                children: [
                  if (beefCategory != null)
                    CategorySection(
                      title: "Beef Meats",
                      icon: Icons.set_meal, // use any suitable icon
                      products: _all_products,
                      categoryId: beefCategory.id,
                      onSeeAll: () => context.push('/filtered?category=${beefCategory.id}'),
                    ),
                ],
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  "Топ мясо",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: primaryColor,
                  ),
                ),
              ),
            ),
            SliverList(
              delegate: SliverChildBuilderDelegate(
                    (context, index) {
                  final product = _products[index];
                  return ProductCard(product: product);
                },
                childCount:
                _visibleTopCount.clamp(0, _products.length),
              ),
            ),
            // "Load more" button for Top
            if (_visibleTopCount < _products.length)
              SliverToBoxAdapter(
                child: Center(
                  child: TextButton(
                    style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all(
                            primaryColor
                        )
                    ),
                    onPressed: _loadMoreTop,
                    child: Text(
                      "Показать больше",
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ),
              ),
            SliverToBoxAdapter(
              child: Column(
                children: [
                  if (chickenCategory != null)
                    CategorySection(
                      title: "Chicken Meats",
                      icon: Icons.egg,
                      products: _all_products,
                      categoryId: chickenCategory.id,
                      onSeeAll: () => context.push('/filtered?category=${chickenCategory.id}'),
                    ),
                  if (marbledBeef != null)
                    CategorySection(
                      title: "Marbled Beef",
                      icon: Icons.restaurant,
                      products: _all_products,
                      categoryId: marbledBeef.id,
                      onSeeAll: () => context.push('/filtered?category=${marbledBeef.id}'),
                    ),
                ],
              ),
            ),

            // --- Все продукции section ---
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.only(
                  top: 16,
                  bottom: 0,
                  left: 16,
                ),
                child: Text(
                  'Все продукции',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: primaryColor,
                  ),
                ),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.all(8),
              sliver: SliverGrid(
                delegate: SliverChildBuilderDelegate(
                      (context, index) {
                    return ProductTile(product: _all_products[index]);
                  },
                  childCount: _visibleAllCount.clamp(
                      0, _all_products.length),
                ),
                gridDelegate:
                const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 8,
                  crossAxisSpacing: 8,
                  childAspectRatio: 0.7,
                ),
              ),
            ),
            if (_visibleAllCount < _all_products.length)
              SliverToBoxAdapter(
                child: Center(
                  child: TextButton(
                    style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all(
                        primaryColor
                      )
                    ),
                    onPressed: _loadMoreAll,
                    child: Text(
                      "Показать больше",
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
      floatingActionButton: Consumer<CartProvider>(
        builder: (context, cart, child) {
          return Stack(
            clipBehavior: Clip.none,
            children: [
              FloatingActionButton(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(50),
                ),
                onPressed: () => context.push('/cart'),
                backgroundColor: Colors.red[900],
                child: const Icon(
                  Icons.shopping_cart,
                  color: Colors.white,
                  size: 24,
                ),
              ),
              if (cart.totalItems > 0)
                Positioned(
                  right: -4,
                  top: -4,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 20,
                      minHeight: 20,
                    ),
                    child: Text(
                      '${cart.totalItems}',
                      style: TextStyle(
                        color: primaryColor,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}