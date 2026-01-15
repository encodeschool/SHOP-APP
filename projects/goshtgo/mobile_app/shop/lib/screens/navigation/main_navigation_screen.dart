import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:shop/l10n/app_localizations.dart';
import '../../core/auth_provider.dart';
import '../../core/cart_provider.dart';

class MainNavigationScreen extends StatefulWidget {
  final Widget child;
  const MainNavigationScreen({super.key, required this.child});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _selectedIndex = 0;
  final tabs = ['/home', '/shop', '/profile', '/cart'];

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final location = GoRouter.of(context).routerDelegate.currentConfiguration.fullPath;
    if (location.startsWith('/home')) _selectedIndex = 0;
    else if (location.startsWith('/shop')) _selectedIndex = 1;
    else if (location.startsWith('/profile')) _selectedIndex = 2;
    else if (location.startsWith('/cart')) _selectedIndex = 3;
  }

  void _onTap(int index) {
    final isLoggedIn = context.read<AuthProvider>().isLoggedIn;

    // Intercept profile tap if not logged in
    if (index == 2 && !isLoggedIn) {
      context.go('/login');
      return;
    }

    setState(() => _selectedIndex = index);
    context.go(tabs[index]);
  }

  @override
  Widget build(BuildContext context) {
    final isLoggedIn = context.watch<AuthProvider>().isLoggedIn;
    final primaryColor = Colors.red[900];
    final loc = AppLocalizations.of(context)!;

    return Scaffold(
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onTap,
        selectedItemColor: primaryColor,
        unselectedItemColor: Colors.grey,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold),
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: loc.home,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.store),
            label: loc.shop,
          ),
          BottomNavigationBarItem(
            icon: Icon(isLoggedIn ? Icons.person : Icons.login),
            label: isLoggedIn ?  loc.profile : loc.login,
          ),
        ],
      ),
    );
  }
}

// FUTURE IMPLEMENTATION
//
// import 'package:flutter/material.dart';
// import 'package:go_router/go_router.dart';
// import 'package:provider/provider.dart';
// import 'package:shop/l10n/app_localizations.dart';
// import '../../core/auth_provider.dart';
// import '../../core/cart_provider.dart';
//
// class MainNavigationScreen extends StatefulWidget {
//   final Widget child;
//   const MainNavigationScreen({super.key, required this.child});
//
//   @override
//   State<MainNavigationScreen> createState() => _MainNavigationScreenState();
// }
//
// class _MainNavigationScreenState extends State<MainNavigationScreen> {
//   int _selectedIndex = 0;
//   final tabs = ['/home', '/shop', '/profile', '/cart'];
//
//   @override
//   void didChangeDependencies() {
//     super.didChangeDependencies();
//     final location = GoRouter.of(context).routerDelegate.currentConfiguration.fullPath;
//     if (location.startsWith('/home')) _selectedIndex = 0;
//     else if (location.startsWith('/shop')) _selectedIndex = 1;
//     else if (location.startsWith('/profile')) _selectedIndex = 2;
//     else if (location.startsWith('/cart')) _selectedIndex = 3;
//   }
//
//   void _onTap(int index) {
//     final isLoggedIn = context.read<AuthProvider>().isLoggedIn;
//
//     if (index == 2 && !isLoggedIn) {
//       context.go('/login');
//       return;
//     }
//
//     setState(() => _selectedIndex = index);
//     context.go(tabs[index]);
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     final isLoggedIn = context.watch<AuthProvider>().isLoggedIn;
//     final cart = context.watch<CartProvider>();
//     final loc = AppLocalizations.of(context)!;
//     final primaryColor = Colors.red[900];
//
//     return Scaffold(
//       body: widget.child,
//       bottomNavigationBar: Container(
//         decoration: BoxDecoration(
//           color: Colors.white,
//           boxShadow: [
//             BoxShadow(
//               color: Colors.black.withOpacity(0.08),
//               blurRadius: 8,
//               offset: const Offset(0, -3),
//             ),
//           ],
//           borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
//         ),
//         child: ClipRRect(
//           borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
//           child: BottomNavigationBar(
//             currentIndex: _selectedIndex,
//             onTap: _onTap,
//             type: BottomNavigationBarType.fixed,
//             backgroundColor: Colors.white,
//             selectedItemColor: primaryColor,
//             unselectedItemColor: Colors.grey[500],
//             showUnselectedLabels: true,
//             selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold),
//             items: [
//               BottomNavigationBarItem(
//                 icon: const Icon(Icons.home),
//                 label: loc.home,
//               ),
//               BottomNavigationBarItem(
//                 icon: const Icon(Icons.store),
//                 label: loc.shop,
//               ),
//               BottomNavigationBarItem(
//                 icon: Icon(isLoggedIn ? Icons.person : Icons.login),
//                 label: isLoggedIn ? loc.profile : loc.login,
//               ),
//               BottomNavigationBarItem(
//                 icon: Stack(
//                   children: [
//                     const Icon(Icons.shopping_bag),
//                     if (cart.items.isNotEmpty)
//                       Positioned(
//                         right: 0,
//                         bottom: 0,
//                         child: Container(
//                           padding: const EdgeInsets.all(2),
//                           decoration: BoxDecoration(
//                             color: Colors.red[900],
//                             borderRadius: BorderRadius.circular(8),
//                           ),
//                           constraints: const BoxConstraints(
//                             minWidth: 16,
//                             minHeight: 16,
//                           ),
//                           child: Text(
//                             cart.items.length.toString(),
//                             style: const TextStyle(
//                               color: Colors.white,
//                               fontSize: 10,
//                               fontWeight: FontWeight.bold,
//                             ),
//                             textAlign: TextAlign.center,
//                           ),
//                         ),
//                       ),
//                   ],
//                 ),
//                 label: loc.cart,
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
