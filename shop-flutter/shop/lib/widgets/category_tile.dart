import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../models/category_model.dart';

class CategoryTile extends StatelessWidget {
  final Category category;

  const CategoryTile({super.key, required this.category});

  @override
  Widget build(BuildContext context) {
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
                radius: 40, backgroundColor: Colors.grey[300],
                // child: Text(category.name[0])
                child: category.icon != null ? Image.network(
                    'http://10.0.2.2:8080${category.icon}',
                    fit: BoxFit.contain,
                    width: 50,
                    height: 50
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
