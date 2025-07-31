import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:go_router/go_router.dart';
import 'package:shop/core/favorite_provider.dart';
import 'package:shop/screens/auth/login_screen.dart';
import 'package:shop/screens/auth/register_screen.dart';
import 'package:shop/screens/cart/cart_screen.dart';
import 'package:shop/screens/category/category_screen.dart';
import 'package:shop/screens/checkout/checkout_screen.dart';
import 'package:shop/screens/checkout/success_screen.dart';
import 'package:shop/screens/home/home_screen.dart';
import 'package:shop/screens/navigation/main_navigation_screen.dart';
import 'package:shop/screens/orders/order_history_screen.dart';
import 'package:shop/screens/product/product_add_screen.dart';
import 'package:shop/screens/product/product_detail_screen.dart';
import 'package:provider/provider.dart';
import 'package:shop/screens/profile/profile_edit_screen.dart';
import 'package:shop/screens/profile/profile_screen.dart';
import 'package:shop/screens/settings/settings_screen.dart';
import 'core/auth_provider.dart';
import 'core/cart_provider.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  Stripe.publishableKey = "pk_test_"; // Replace with your Stripe test key

  final storage = FlutterSecureStorage();
  final token = await storage.read(key: 'token');
  final isLoggedIn = token != null;

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => FavoriteProvider()),
      ],
      child: MyApp(initialRoute: isLoggedIn ? '/home' : '/login'),
    ),
  );
}

GoRouter createRouter(String initialRoute) => GoRouter(
  initialLocation: '/home',
  routes: [
    GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterScreen(),
    ),
    GoRoute(
      path: '/success',
      builder: (context, state) => const SuccessScreen(),
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const SettingScreen(),
    ),

    ShellRoute(
      builder: (context, state, child) => MainNavigationScreen(child: child),
      routes: [
        GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
        GoRoute(
          path: '/shop',
          builder: (_, __) => const CategoryScreen(
            categoryId: 'null',
            categoryName: 'All Categories',
          ),
        ),
        GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
      ],
    ),

    // Other routes
    GoRoute(path: '/cart', builder: (_, __) => const CartScreen()),
    GoRoute(path: '/checkout', builder: (_, __) => const CheckoutScreen()),
    GoRoute(path: '/orders', builder: (_, __) => const OrderHistoryScreen()),
    GoRoute(path: '/add-product', builder: (_, __) => const ProductAddScreen()),
    GoRoute(
      path: '/product/:id',
      builder: (context, state) {
        final productId = state.pathParameters['id']!;
        return ProductDetailScreen(productId: productId);
      },
    ),
    GoRoute(
      path: '/profile/edit',
      builder: (_, __) => const ProfileEditScreen(),
    ),
    GoRoute(
      path: '/category/:id',
      builder: (context, state) {
        final categoryId = state.pathParameters['id']!;
        final categoryName = state.extra as String? ?? 'Category';
        return CategoryScreen(
          categoryId: categoryId,
          categoryName: categoryName,
        );
      },
    ),
  ],
);

class MyApp extends StatelessWidget {
  final String initialRoute;
  const MyApp({super.key, required this.initialRoute});
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'E-Commerce',
      theme: ThemeData(useMaterial3: true),
      routerConfig: createRouter(initialRoute),
      debugShowCheckedModeBanner: false,
    );
  }
}
