import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../models/category_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class CategoryTile extends StatelessWidget {
  final Category category;

  const CategoryTile({super.key, required this.category});

  @override
  Widget build(BuildContext context) {
    final apiUrl = dotenv.env['API_URL'] ?? 'https://shop.encode.uz/api';

    return Container(
      width: 95,
      margin: const EdgeInsets.symmetric(horizontal: 8),
      child: GestureDetector(
        onTap: () {
          context.push(
            '/category/${category.id}',
            extra: category.name
          );
        },
        child: Column(
          children: [
            CircleAvatar(
                radius: 40, backgroundColor: Colors.red[900],
                // child: Text(category.name[0])
                child: category.icon != null ? ColorFiltered(
                  colorFilter: const ColorFilter.matrix([
                    -1,  0,  0,  0, 255, // Red
                    0, -1,  0,  0, 255, // Green
                    0,  0, -1,  0, 255, // Blue
                    0,  0,  0,  1,   0, // Alpha
                  ]),
                  child: Image.network(
                    '$apiUrl${category.icon}',
                    fit: BoxFit.contain,
                    width: 50,
                    height: 50,
                  ),
                ) : Icon(Icons.image)
            ),
            const SizedBox(height: 8),
            Text(category.name, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}
