import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shop/l10n/app_localizations.dart';

class DeliveryScreen extends StatelessWidget {
  const DeliveryScreen({Key? key}) : super(key: key);

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
          loc.deliveryTitle,
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
            Text(loc.deliveryHeader,
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: primaryColor)),
            const SizedBox(height: 16),
            Text(loc.deliveryText1, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),

            Text(loc.standardDelivery,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: primaryColor)),
            const SizedBox(height: 8),
            Text(loc.standardDeliveryText, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 20),

            Text(loc.expressDelivery,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: primaryColor)),
            const SizedBox(height: 8),
            Text(loc.expressDeliveryText, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 20),

            Text(loc.customDelivery,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: primaryColor)),
            const SizedBox(height: 8),
            Text(loc.customDeliveryText, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),

            Text(loc.guaranteeHeader,
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryColor)),
            Text(loc.guaranteeText, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),

            Text(loc.noteHeader,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: primaryColor)),
            const SizedBox(height: 8),
            Text(loc.noteText, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 16),
            Text(loc.additionalGuarantee, style: const TextStyle(fontSize: 16, fontStyle: FontStyle.italic, height: 1.5)),
            const SizedBox(height: 24),

            Text(loc.appBenefitsHeader,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: primaryColor)),
            const SizedBox(height: 8),
            Text(loc.appBenefitsText, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),

            Text(loc.cashbackHeader,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: primaryColor)),
            const SizedBox(height: 8),
            Text(loc.cashbackText, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),

            Text(loc.cardPaymentHeader,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: primaryColor)),
            const SizedBox(height: 8),
            Text(loc.cardPaymentText, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),

            Text(loc.chilledDeliveryHeader,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: primaryColor)),
            const SizedBox(height: 8),
            Text(loc.chilledDeliveryText, style: const TextStyle(fontSize: 16, height: 1.5)),
            const SizedBox(height: 24),

            Text(loc.qualityHeader,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: primaryColor)),
            const SizedBox(height: 8),
            Text(loc.qualityText, style: const TextStyle(fontSize: 16, height: 1.5)),
          ],
        ),
      ),
    );
  }
}
