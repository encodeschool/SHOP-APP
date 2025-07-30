import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
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

    return Scaffold(
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onTap,
        selectedItemColor: Colors.orange,
        unselectedItemColor: Colors.grey,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold),
        items: [
          const BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.store),
            label: 'Shop',
          ),
          BottomNavigationBarItem(
            icon: Icon(isLoggedIn ? Icons.person : Icons.login),
            label: isLoggedIn ? 'Profile' : 'Login',
          ),
        ],
      ),
    );
  }
}
