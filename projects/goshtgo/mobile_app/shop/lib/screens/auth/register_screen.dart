import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/auth_provider.dart';
import '../../services/auth_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _authService = AuthService();

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _usernameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _loading = false;
  String? _error;

  void _register() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _loading = true;
      _error = null;
    });

    final success = await _authService.register(
      name: _nameController.text,
      email: _emailController.text,
      username: _usernameController.text,
      phone: _phoneController.text,
      password: _passwordController.text,
    );

    setState(() => _loading = false);

    if (success) {
      if (context.mounted) context.go('/home');
      final token = await _authService.getToken();
      final userId = await _authService.getUserId();
      if (token != null && userId != null) {
        await context.read<AuthProvider>().login(token, userId);
        context.go('/home');
      }
    } else {
      setState(() => _error = 'Registration failed. Try again.');
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    final primaryColor = Colors.red[900];
    return Scaffold(
      // appBar: AppBar(title: const Text("Register")),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // 🆕 Added logo at the top
              SvgPicture.asset(
                'assets/logo/logo.svg',
                width: 80,
                height: 80,
              ),
              const SizedBox(height: 24),
              if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: "Полное имя"),
                validator: (val) => val!.isEmpty ? "Обязательно" : null,
              ),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: "Почта"),
                validator: (val) => val!.contains('@') ? null : "Неправильная почта",
              ),
              TextFormField(
                controller: _usernameController,
                decoration: const InputDecoration(labelText: "Имя пользователя"),
                validator: (val) => val!.isEmpty ? "Обязательно" : null,
              ),
              TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(labelText: "Телефон"),
                validator: (val) => val!.length < 7 ? "Неправильный номер телефона" : null,
              ),
              TextFormField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(labelText: "Пароль"),
                validator: (val) => val!.length < 6 ? "Мин. 6 символов" : null,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _loading ? null : _register,
                child: _loading ? const CircularProgressIndicator() : const Text(
                    "Регистрация",
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
                  backgroundColor: primaryColor,
                )
              ),
              TextButton(
                onPressed: () => context.go('/login'),
                child: const Text(
                    "У вас уже есть аккаунт? Войдите в учетную запись",
                    style: TextStyle(
                        color: Colors.grey
                    )
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
