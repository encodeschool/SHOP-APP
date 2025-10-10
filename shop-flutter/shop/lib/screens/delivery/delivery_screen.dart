import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class DeliveryScreen extends StatelessWidget {
  const DeliveryScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final primaryColor = Colors.red[900];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: primaryColor,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          "Доставка",
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
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "🚚 Доставка GoshtGo — свежесть прямо к вашему столу",
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              "Мы доставляем свежее мясо по Ташкенту с гарантией качества и точностью во времени.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              "Стандартная доставка",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "• Бесплатно по Ташкенту — при заказе от 300 000 сум.\n"
                  "• 20 000 сум — при заказе до 300 000 сум.\n"
                  "• Минимальная сумма заказа указана без учёта стоимости доставки.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 20),

            Text(
              "Экспресс-доставка",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "• 40 000 сум — доставка в день оформления заказа.\n"
                  "• 3–5 часов — если заказ сделан до 18:00.\n"
                  "• Оплата — онлайн картой или QR-кодом после комплектации.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 20),

            Text(
              "Индивидуальные решения",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Хотите доставку точно ко времени или за пределы стандартной зоны Ташкента? "
                  "Свяжитесь с нашим менеджером — мы подстроим маршрут и предложим оптимальное решение.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              "💡 GoshtGo гарантирует:",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: primaryColor,
              ),
            ),
            const Text(
              "Каждый заказ приходит свежим, аккуратно упакованным и вовремя.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              "ℹ️ Обратите внимание",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Каждое мясо нарезается вручную специально для вашего заказа, чтобы сохранить вкус и текстуру.\n\n"
                  "Итоговый вес может отличаться в пределах ±10–15 %. Мы сообщим точную сумму после комплектации и согласуем, если разница превышает 10%.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),
            const Text(
              "💡 GoshtGo гарантирует: честность, прозрачность и вкус, который рождается в момент нарезки.",
              style: TextStyle(fontSize: 16, fontStyle: FontStyle.italic, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              "📱 Удобнее и выгоднее в приложении GoshtGo",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "• Повышенный кешбэк за все заказы.\n"
                  "• Удобный повтор заказов в один клик.\n"
                  "• Быстрые уведомления о статусе и акциях.\n\n"
                  "Скачайте приложение GoshtGo для iOS или Android — и любимый стейк будет на расстоянии одного касания.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              "💎 Кешбэк за покупки",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Оплачивайте по QR и получайте 1 % кешбэка от суммы чека. "
                  "Дополнительно кешбэк начисляется на товары со значком «Кешбэк».\n\n"
                  "Как использовать бонусы:\n"
                  "• 1 бонус = 1 сум — можно оплатить до 100 % заказа.\n"
                  "• Бонусы активны 1 год с момента начисления.\n"
                  "• Бонусы и промокоды не суммируются.\n"
                  "• Баланс можно проверить в приложении GoshtGo.\n\n"
                  "💡 Каждая покупка — вкусная и выгодная.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              "💳 Оплата банковской картой",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Принимаем UZCARD, HUMO, Uzum Bank, Mastercard, Visa и другие. "
                  "Списания происходят только после комплектации заказа.\n\n"
                  "💡 Совет GoshtGo: выбирайте оплату картой или через QR — это быстрее, безопаснее и выгоднее.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              "❄️ Охлаждённая доставка — свежесть под контролем",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Каждый заказ упаковывается в контейнеры с температурой не выше +4 °C и доставляется в рефрижераторах. "
                  "Даже в жару мясо остаётся идеально свежим.\n\n"
                  "💡 GoshtGo гарантирует: от цеха до двери — идеальная свежесть.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              "🏆 Гарантия качества 100 %",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Мы предлагаем только первоклассное мясо. Если продукт не оправдал ожиданий — вернём 100 % стоимости или заменим.\n\n"
                  "💡 Ваше спокойствие — наш главный стандарт качества.\n\n"
                  "✨ GoshtGo гарантирует: каждая покупка должна радовать.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
          ],
        ),
      ),
    );
  }
}
