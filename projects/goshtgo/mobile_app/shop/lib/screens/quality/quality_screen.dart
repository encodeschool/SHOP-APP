import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shop/l10n/app_localizations.dart';

class QualityScreen extends StatelessWidget {
  const QualityScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final primaryColor = Colors.red[900];
    final loc = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: primaryColor,
        elevation: 0,
        centerTitle: true,
        title: Text(
          loc.qualityTitle,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/home');
            }
          },
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(loc.qualityHeader1,
                style: TextStyle(
                    fontSize: 22, fontWeight: FontWeight.bold, color: primaryColor)),
            const SizedBox(height: 16),
            Text(loc.qualityText1, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),

            Text(loc.qualityHeader2,
                style: TextStyle(
                    fontSize: 20, fontWeight: FontWeight.w600, color: primaryColor)),
            const SizedBox(height: 8),
            Text(loc.qualityText2, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),

            Text(loc.qualityHeader3,
                style: TextStyle(
                    fontSize: 20, fontWeight: FontWeight.w600, color: primaryColor)),
            const SizedBox(height: 8),
            Text(loc.qualityText3, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),

            Text(loc.qualityHeader4,
                style: TextStyle(
                    fontSize: 20, fontWeight: FontWeight.w600, color: primaryColor)),
            const SizedBox(height: 8),
            Text(loc.qualityText4, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),

            Text(loc.qualityHeader5,
                style: TextStyle(
                    fontSize: 20, fontWeight: FontWeight.w600, color: primaryColor)),
            const SizedBox(height: 8),
            Text(loc.qualityText5, style: const TextStyle(fontSize: 16, height: 1.5)),
          ],
        ),
      ),
    );
  }
}