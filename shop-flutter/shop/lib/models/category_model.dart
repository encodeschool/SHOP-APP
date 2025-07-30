class Category {
  final String id;
  final String name;
  final String? icon;

  Category({required this.id, required this.name, required this.icon});

  factory Category.fromJson(Map<String, dynamic> json) => Category(
    id: json['id'],
    name: json['name'],
    icon: json['icon'],
  );
}
