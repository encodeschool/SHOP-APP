import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:enroute/l10n/app_localizations.dart';

class SuccessScreen extends StatelessWidget {
  const SuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context)!;

    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Center(
            child: Text(
              loc.paymentSuccess,
              style: const TextStyle(
                  fontSize: 22,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => context.go('/home'),
            child: Text(
                loc.backHome,
                style: TextStyle(
                  color: Colors.white
                ),
            ),
            style: ButtonStyle(
              backgroundColor: MaterialStatePropertyAll(Colors.red[900])
            ),
          ),
        ],
      ),
    );
  }
}
