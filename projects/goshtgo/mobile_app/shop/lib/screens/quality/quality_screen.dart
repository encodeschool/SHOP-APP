import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class QualityScreen extends StatelessWidget {
  const QualityScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final primaryColor = Colors.red[900];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: primaryColor,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          "Качество",
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
              "🌿 GoshtGo — новое имя премиального мяса в Узбекистане",
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              "Мы начинаем сегодня, чтобы задать будущее качества. С первых дней мы работаем по принципам, которые делают мировой гастрономический рынок эталоном: честное происхождение, уважение к природе и вкус, созданный временем, а не спешкой.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              "Чистота от земли до тарелки",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Качество мяса начинается с земли, на которой растут корма. Наши фермерские партнёры выращивают их на собственных полях, свободных от пестицидов, где животные живут на открытых пастбищах, двигаются так, как задумано природой, и никогда не знакомятся с гормонами роста, антибиотиками или стимуляторами аппетита.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              "Натуральный ритм",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Мы верим: великое мясо не рождается в спешке. Здоровые животные растут в гармонии и без стресса, что формирует тонкий вкус, правильную структуру и естественный аромат, недостижимые при индустриальном подходе.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              "Ручная работа мастеров",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Каждая поставка — это отборное мясо молодых животных, которое поступает ежедневно и разделывается вручную опытными мясниками. Только так можно сохранить живую текстуру и богатый вкус, который ценят шеф-повара и настоящие гурманы.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 24),

            Text(
              "💡 GoshtGo — это больше, чем магазин.",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Это культура ответственного мяса в Ташкенте: от пастбища до вашей кухни — без компромиссов, без лишних посредников и без потери свежести.",
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
          ],
        ),
      ),
    );
  }
}