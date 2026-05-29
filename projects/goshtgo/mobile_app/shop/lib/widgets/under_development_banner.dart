import 'package:flutter/material.dart';
import 'package:shop/l10n/app_localizations.dart';

class UnderDevelopmentBanner extends StatelessWidget {
  const UnderDevelopmentBanner({super.key});

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context)!;

    return Container(
      width: double.infinity,
      color: Colors.yellow.shade100,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          const Icon(Icons.construction, color: Colors.brown, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              loc.websiteUnderDevelopmentMessage,
              style: TextStyle(
                color: Colors.brown[900],
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
