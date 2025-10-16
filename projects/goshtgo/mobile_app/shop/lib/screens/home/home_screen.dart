import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:shop/l10n/app_localizations.dart';
import 'package:shop/widgets/carousel_section.dart';
import 'package:shop/widgets/category_section.dart';
import 'package:shop/widgets/category_tile.dart';
import 'package:shop/widgets/product_card.dart';
import 'package:shop/widgets/product_tile.dart';
import '../../core/cart_provider.dart';
import '../../models/category_model.dart';
import '../../models/product_model.dart';
import '../../models/user_model.dart';
import '../../services/category_service.dart';
import '../../services/product_service.dart';
import '../../services/user_service.dart';

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
  List<Product> _allProducts = [];
  Product? searchedProduct;
  User? _user;
  bool _loading = true;

  int _visibleTopCount = 4;
  int _visibleAllCount = 6;
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
      _allProducts = await productService.fetchAllProducts();
      _user = await userService.getUserDetails();

      _productsByCategory.clear();
      for (var product in _allProducts) {
        _productsByCategory.putIfAbsent(product.categoryId, () => []).add(product);
      }
    } catch (e) {
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
      _visibleAllCount = (_visibleAllCount + 6).clamp(0, _allProducts.length);
    });
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context)!;
    final primaryColor = Colors.red[900];
    final beefCategory = findSubcategoryByCode('beef');
    final chickenCategory = findSubcategoryByCode('chicken');
    final marbledBeef = findSubcategoryByCode('marbled');

    return Scaffold(
      drawer: Drawer(
        backgroundColor: Colors.white,
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              padding: EdgeInsets.zero,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network('https://picsum.photos/800/400?img=1', fit: BoxFit.cover),
                  Container(color: Colors.red[900]!.withOpacity(0.7)),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Align(
                      alignment: Alignment.bottomLeft,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(loc.appTitle, style: const TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 6),
                          Text(loc.appSlogan, style: const TextStyle(color: Colors.white70, fontSize: 14)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.home),
              title: Text(loc.about),
              onTap: () { Navigator.pop(context); context.go('/about'); },
            ),
            ListTile(
              leading: const Icon(Icons.delivery_dining),
              title: Text(loc.delivery),
              onTap: () { Navigator.pop(context); context.go('/delivery'); },
            ),
            ListTile(
              leading: const Icon(Icons.high_quality),
              title: Text(loc.quality),
              onTap: () { Navigator.pop(context); context.go('/quality'); },
            ),
            ListTile(
              leading: const Icon(Icons.support),
              title: Text(loc.contact),
              onTap: () { Navigator.pop(context); context.go('/contact'); },
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
                        SvgPicture.asset('assets/logo/logo.svg', width: 50, height: 50),
                        Builder(
                          builder: (context) => IconButton(
                            icon: const Icon(Icons.menu, size: 32),
                            onPressed: () => Scaffold.of(context).openDrawer(),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 15),
                    Text(loc.appSlogan, style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: primaryColor)),
                    Text(loc.appSubtitle, style: TextStyle(color: primaryColor?.withOpacity(0.6))),
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
                          decoration: InputDecoration(
                            hintText: loc.searchHint,
                            border: InputBorder.none,
                            isDense: true,
                          ),
                          onChanged: (value) {},
                        ),
                      ),
                      if (_loading) CircularProgressIndicator(color: primaryColor),
                    ],
                  ),
                ),
              ),
            ),
            SliverToBoxAdapter(child: Padding(padding: const EdgeInsets.all(16), child: Text('Категории', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryColor)))),
            SliverToBoxAdapter(
              child: SizedBox(
                height: 140,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: _categories.length,
                  itemBuilder: (context, index) => CategoryTile(category: _categories[index]),
                ),
              ),
            ),
            SliverToBoxAdapter(child: CarouselSection()),
            if (beefCategory != null)
              SliverToBoxAdapter(
                child: CategorySection(
                  title: loc.beefSection,
                  icon: Icons.set_meal,
                  products: _allProducts,
                  categoryId: beefCategory.id,
                  onSeeAll: () => context.push('/filtered?category=${beefCategory.id}'),
                ),
              ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(loc.showMore, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryColor)),
              ),
            ),
            SliverList(
              delegate: SliverChildBuilderDelegate(
                    (context, index) => ProductCard(product: _products[index]),
                childCount: _visibleTopCount.clamp(0, _products.length),
              ),
            ),
            if (_visibleTopCount < _products.length)
              SliverToBoxAdapter(
                child: Center(
                  child: TextButton(
                    style: ButtonStyle(backgroundColor: MaterialStateProperty.all(primaryColor)),
                    onPressed: _loadMoreTop,
                    child: Text(loc.showMore, style: const TextStyle(color: Colors.white)),
                  ),
                ),
              ),
            if (chickenCategory != null)
              SliverToBoxAdapter(
                child: CategorySection(
                  title: loc.chickenSection,
                  icon: Icons.egg,
                  products: _allProducts,
                  categoryId: chickenCategory.id,
                  onSeeAll: () => context.push('/filtered?category=${chickenCategory.id}'),
                ),
              ),
            if (marbledBeef != null)
              SliverToBoxAdapter(
                child: CategorySection(
                  title: loc.marbledSection,
                  icon: Icons.restaurant,
                  products: _allProducts,
                  categoryId: marbledBeef.id,
                  onSeeAll: () => context.push('/filtered?category=${marbledBeef.id}'),
                ),
              ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.only(top: 16, left: 16),
                child: Text(loc.allProductsSection, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryColor)),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.all(8),
              sliver: SliverGrid(
                delegate: SliverChildBuilderDelegate(
                      (context, index) => ProductTile(product: _allProducts[index]),
                  childCount: _visibleAllCount.clamp(0, _allProducts.length),
                ),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 8,
                  crossAxisSpacing: 8,
                  childAspectRatio: 0.7,
                ),
              ),
            ),
            if (_visibleAllCount < _allProducts.length)
              SliverToBoxAdapter(
                child: Center(
                  child: TextButton(
                    style: ButtonStyle(backgroundColor: MaterialStateProperty.all(primaryColor)),
                    onPressed: _loadMoreAll,
                    child: Text(loc.showMore, style: const TextStyle(color: Colors.white)),
                  ),
                ),
              ),
          ],
        ),
      ),
      floatingActionButton: Consumer<CartProvider>(
        builder: (context, cart, child) => Stack(
          clipBehavior: Clip.none,
          children: [
            FloatingActionButton(
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
              onPressed: () => context.push('/cart'),
              backgroundColor: Colors.red[900],
              child: const Icon(Icons.shopping_cart, color: Colors.white, size: 24),
            ),
            if (cart.totalItems > 0)
              Positioned(
                right: -4,
                top: -4,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                  constraints: const BoxConstraints(minWidth: 20, minHeight: 20),
                  child: Text(
                    '${cart.totalItems}',
                    style: TextStyle(color: primaryColor, fontSize: 12, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}