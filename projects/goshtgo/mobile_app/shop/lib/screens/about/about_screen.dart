import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final Color primaryColor = Colors.red[900]!;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: primaryColor,
        elevation: 0,
        centerTitle: true,
        title: Text(
          "О нас",
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: Row(
          children: [
            IconButton(
              icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
              onPressed: () {
                if (context.canPop()) {
                  context.pop();
                } else {
                  context.go('/home'); // or go back to home
                }
              },
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🥩 Title
            Text(
              '🥩 О нас — Честное мясо нового поколения',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 16),

            const Text(
              'Мы создали GoshtGo, чтобы изменить культуру покупки мяса в Узбекистане. '
                  'Нам важно, чтобы каждая семья получала свежее, халяльное и безопасное мясо, '
                  'а не компромиссы и разочарования.',
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              'Что мы хотим прекратить навсегда',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 12),

            const Text(
              'Мы не хотим видеть:\n\n'
                  '• как мясо заворачивают в старую бумагу на базаре;\n'
                  '• как продукт трогают голыми руками во время торговли;\n'
                  '• как вокруг крутятся мухи, портящие качество;\n'
                  '• как мясо летом проводит по 1–2 часа в жаре, теряя свежесть и вкус;\n'
                  '• как покупателям подмешивают кости, жир или лишние куски, обманывая на весе.',
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              'Наше решение',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 12),

            const Text(
              '• Мясо проходит халяльный забой и разделку в стерильных условиях.\n'
                  '• Каждый заказ герметично упаковывается и доставляется в охлаждённых контейнерах с постоянной температурой не выше +4 °C.\n'
                  '• Весь процесс прозрачен — от приёмки и хранения до момента доставки.\n'
                  '• Вы всегда получаете точный вес и честную цену, без костей и лишнего жира.',
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              'Наша философия',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 12),

            const Text(
              'Для нас мясо — это чистота, уважение и доверие. Мы хотим, чтобы каждая семья знала: '
                  'за свои деньги она покупает доступное, премиальное и по-настоящему халяльное мясо.\n\n'
                  'Мы не просто продаём продукт — мы меняем культуру потребления, '
                  'чтобы покупки стали безопасными, честными и достойными современного Ташкента.\n\n'
                  '💡 GoshtGo — это новое качество мясного рынка Узбекистана. '
                  'От фермы до вашей кухни мы контролируем каждый шаг, чтобы на вашем столе всегда было '
                  'чистое, свежее и честное мясо — без обмана и компромиссов.',
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
