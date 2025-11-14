import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shop/screens/about/about_screen.dart';
import 'package:shop/screens/ai/ai_help_screen.dart';
import 'package:shop/screens/auth/login_screen.dart';
import 'package:shop/screens/auth/register_screen.dart';
import 'package:shop/screens/cart/cart_screen.dart';
import 'package:shop/screens/category/category_screen.dart';
import 'package:shop/screens/checkout/checkout_screen.dart';
import 'package:shop/screens/checkout/success_screen.dart';
import 'package:shop/screens/contact/contact_screen.dart';
import 'package:shop/screens/delivery/delivery_screen.dart';
import 'package:shop/screens/home/home_screen.dart';
import 'package:shop/screens/navigation/main_navigation_screen.dart';
import 'package:shop/screens/noInternet/no_internet_screen.dart';
import 'package:shop/screens/onboarding/onboarding_screen.dart';
import 'package:shop/screens/orders/order_history_screen.dart';
import 'package:shop/screens/product/product_add_screen.dart';
import 'package:shop/screens/product/product_detail_screen.dart';
import 'package:provider/provider.dart';
import 'package:shop/screens/profile/profile_edit_screen.dart';
import 'package:shop/screens/profile/profile_screen.dart';
import 'package:shop/screens/quality/quality_screen.dart';
import 'package:shop/screens/settings/settings_screen.dart';
import 'core/api_client.dart';
import 'core/auth_provider.dart';
import 'core/cart_provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'core/locale_provider.dart';
import 'core/network_manager.dart';
import 'l10n/app_localizations.dart';
import 'package:flutter/material.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  const bool isProd = bool.fromEnvironment('dart.vm.product');
  final envFile = isProd ? ".env.production" : ".env.development";
  await dotenv.load(fileName: envFile);

  ApiClient().initialize();
  NetworkManager().initialize();

  final stripeKey = dotenv.env['STRIPE_KEY'] ?? "pk_test_fallback";
  Stripe.publishableKey = stripeKey;

  final authProvider = AuthProvider();
  await authProvider.loadAuthData();

  final prefs = await SharedPreferences.getInstance();
  final onboardingShown = prefs.getBool('onboarding_shown') ?? false;

  // Determine the first screen
  String initialRoute;
  if (!onboardingShown) {
    initialRoute = '/onboarding';
  } else if (authProvider.isLoggedIn) {
    initialRoute = '/home';
  } else {
    initialRoute = '/login';
  }

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => authProvider),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => LocaleProvider()..loadLocale()),
      ],
      child: MyApp(initialRoute: initialRoute),
    ),
  );
}

GoRouter createRouter(String initialRoute) => GoRouter(
  initialLocation: initialRoute,
  navigatorKey: navigatorKey,
  routes: [
    GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
    GoRoute(
      path: '/onboarding',
      builder: (context, state) => const OnboardingScreen(),
    ),
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
    GoRoute(
      path: '/ai',
      builder: (context, state) => const AIHelpScreen(),
    ),

    ShellRoute(
      builder: (context, state, child) => MainNavigationScreen(child: child),
      routes: [
        GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
        GoRoute(
          path: '/shop',
          builder: (_, __) => const CategoryScreen(
            categoryId: 'null',
            categoryName: 'Все категории',
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
    GoRoute(path: '/about', builder: (_, __) => const AboutScreen()),
    GoRoute(path: '/delivery', builder: (_, __) => const DeliveryScreen()),
    GoRoute(path: '/quality', builder: (_, __) => const QualityScreen()),
    GoRoute(path: '/contact', builder: (_, __) => const ContactScreen()),
  ],
);

class MyApp extends StatelessWidget {
  final String initialRoute;
  const MyApp({super.key, required this.initialRoute});

  @override
  Widget build(BuildContext context) {
    final localeProvider = context.watch<LocaleProvider>();

    return StreamBuilder<bool>(
      stream: NetworkManager().connectionStream,
      initialData: true,
      builder: (context, snapshot) {
        final hasInternet = snapshot.data ?? true;

        return MaterialApp.router(
          title: 'Gosht Go',
          theme: ThemeData(useMaterial3: true),
          routerConfig: createRouter(initialRoute),
          debugShowCheckedModeBanner: false,
          locale: localeProvider.locale,
          supportedLocales: const [
            Locale('en'),
            Locale('ru'),
            Locale('uz'),
          ],
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          builder: (context, child) {
            return Stack(
              children: [
                child ?? const SizedBox(),
                if (!hasInternet) NoInternetOverlay(),
              ],
            );
          },
        );
      },
    );
  }
}