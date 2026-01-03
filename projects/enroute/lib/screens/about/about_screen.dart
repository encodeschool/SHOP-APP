import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:enroute/l10n/app_localizations.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final Color primaryColor = Colors.red[900]!;
    final loc = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: primaryColor,
        elevation: 0,
        centerTitle: true,
        title: Text(loc.aboutTitle, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
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
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(loc.aboutSubtitle, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: primaryColor)),
            const SizedBox(height: 16),
            Text(loc.aboutDescription, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),
            Text(loc.aboutStopTitle, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryColor)),
            const SizedBox(height: 12),
            Text(loc.aboutStopList, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),
            Text(loc.aboutSolutionTitle, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryColor)),
            const SizedBox(height: 12),
            Text(loc.aboutSolutionList, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),
            Text(loc.aboutPhilosophyTitle, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryColor)),
            const SizedBox(height: 12),
            Text(loc.aboutPhilosophyText, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
