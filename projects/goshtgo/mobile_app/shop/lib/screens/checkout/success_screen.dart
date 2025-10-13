import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class SuccessScreen extends StatelessWidget {
  const SuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Center(child: Text("✅ Payment Successful", style: TextStyle(fontSize: 22))),
          ElevatedButton(
              onPressed: () => context.go('/home'),
              child: Text(
                'Назад на главную'
              )
          )
        ],
      ),
    );
  }
}
