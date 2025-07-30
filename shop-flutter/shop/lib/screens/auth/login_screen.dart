import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/auth_provider.dart';
import '../../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();
  bool _loading = false;
  String? _error;

  void _login() async {
    setState(() => _loading = true);
    final success = await _authService.login(
      _emailController.text,
      _passwordController.text,
    );
    setState(() => _loading = false);

    if (success) {
      if (context.mounted) {
        context.go('/home');
        context.read<AuthProvider>().login();
        context.go('/profile'); // or wherever you want to go after login
      }
    } else {
      setState(() => _error = 'Login failed. Check credentials.');
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Text("Login", style: Theme.of(context).textTheme.headlineMedium),
            Image.asset(
                'assets/icon/playstore.png',
                width: 50,
                height: 50
            ),
            const SizedBox(height: 24),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Password'),
            ),
            const SizedBox(height: 24),
            if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
            ElevatedButton(
              onPressed: _loading ? null : _login,
              child: _loading ? const CircularProgressIndicator() : const Text(
                  "Login",
                  style: TextStyle(
                    color: Colors.white
                  )
              ),
              style: ElevatedButton.styleFrom(
                minimumSize: Size(size.width, 40),
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12), // Rounded corners for aesthetics
                ),
                backgroundColor: Colors.orange,
              )
            ),
            TextButton(
              onPressed: () => context.go('/register'),
              child: Text(
                  "Do not have an account? Create account",
                  style: TextStyle(
                    color: Colors.grey
                  )
              ),
            )
          ],
        ),
      ),
    );
  }
}
