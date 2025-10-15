import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';

class CarouselSection extends StatelessWidget {
  final List<Map<String, String>> slides = [
    {
      'image': 'https://picsum.photos/800/400?img=1',
      'title': 'Лучшее мясо',
      'description': 'Свежие продукты прямо от фермеров',
      'button': 'Заказать сейчас',
    },
    {
      'image': 'https://picsum.photos/800/400?img=2',
      'title': 'Натуральные ингредиенты',
      'description': 'Без добавок и консервантов',
      'button': 'Подробнее',
    },
    {
      'image': 'https://picsum.photos/800/400?img=3',
      'title': 'Доставка по городу',
      'description': 'Получите заказ за 2 часа',
      'button': 'Смотреть каталог',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final primaryColor = Colors.red[900]!;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: CarouselSlider(
        options: CarouselOptions(
          height: 220,
          autoPlay: true,
          enlargeCenterPage: true,
          viewportFraction: 0.9,
          aspectRatio: 16 / 9,
          autoPlayInterval: const Duration(seconds: 4),
        ),
        items: slides.map((slide) {
          return Builder(
            builder: (BuildContext context) {
              return ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    // Background image
                    Image.network(
                      slide['image']!,
                      fit: BoxFit.cover,
                    ),

                    // Red transparent overlay
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            primaryColor.withOpacity(0.7),
                            Colors.black.withOpacity(0.3),
                          ],
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                        ),
                      ),
                    ),

                    // Text and button overlay
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: Align(
                        alignment: Alignment.bottomLeft,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              slide['title']!,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              slide['description']!,
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.9),
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 12),
                            ElevatedButton(
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Clicked: ${slide['button']}')),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: primaryColor,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 20,
                                  vertical: 10,
                                ),
                              ),
                              child: Text(slide['button']!),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        }).toList(),
      ),
    );
  }
}
