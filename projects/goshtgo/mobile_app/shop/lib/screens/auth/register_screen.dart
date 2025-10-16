import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
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

  Future<void> _register() async {
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
      final token = await _authService.getToken();
      final userId = await _authService.getUserId();
      if (token != null && userId != null) {
        await context.read<AuthProvider>().login(token, userId);
        if (context.mounted) context.go('/home');
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Вы зарегистрировались успешно'),
          duration: const Duration(seconds: 2),
        ),
      );
    } else {
      setState(() => _error = 'Registration failed. Try again.');
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final primaryColor = Colors.red[900];

    return Scaffold(
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: size.height - MediaQuery.of(context).padding.vertical,
            ),
            child: IntrinsicHeight(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SvgPicture.asset(
                          'assets/logo/logo.svg',
                          width: 80,
                          height: 80,
                        ),
                        const SizedBox(height: 24),
                        if (_error != null)
                          Text(
                            _error!,
                            style: const TextStyle(color: Colors.red),
                          ),
                        TextFormField(
                          controller: _nameController,
                          decoration:
                          const InputDecoration(labelText: "Полное имя"),
                          validator: (val) =>
                          val!.isEmpty ? "Обязательно" : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _emailController,
                          decoration:
                          const InputDecoration(labelText: "Почта"),
                          validator: (val) => val!.contains('@')
                              ? null
                              : "Неправильная почта",
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _usernameController,
                          decoration: const InputDecoration(
                              labelText: "Имя пользователя"),
                          validator: (val) =>
                          val!.isEmpty ? "Обязательно" : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _phoneController,
                          decoration:
                          const InputDecoration(labelText: "Телефон"),
                          validator: (val) => val!.length < 7
                              ? "Неправильный номер телефона"
                              : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _passwordController,
                          obscureText: true,
                          decoration:
                          const InputDecoration(labelText: "Пароль"),
                          validator: (val) =>
                          val!.length < 6 ? "Мин. 6 символов" : null,
                        ),
                        const SizedBox(height: 24),
                        ElevatedButton(
                          onPressed: _loading ? null : _register,
                          style: ElevatedButton.styleFrom(
                            minimumSize: Size(size.width, 50),
                            padding:
                            const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            backgroundColor: primaryColor,
                          ),
                          child: _loading
                              ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                              : const Text(
                            "Регистрация",
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                        const SizedBox(height: 12),
                        TextButton(
                          onPressed: () => context.go('/login'),
                          child: const Text(
                            "У вас уже есть аккаунт? Войдите в учетную запись",
                            style: TextStyle(color: Colors.grey),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
