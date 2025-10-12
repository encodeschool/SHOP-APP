class Category {
  final String id;
  final String name;
  final String? icon;
  final String? categoryCode;
  final List<Category>? subcategories;

  Category({
    required this.id,
    required this.name,
    this.icon,
    this.categoryCode,
    this.subcategories,
  });

  factory Category.fromJson(Map<String, dynamic> json) => Category(
    id: json['id'],
    name: json['name'],
    icon: json['icon'],
    categoryCode: json['categoryCode'],
    subcategories: json['subcategories'] != null
        ? List<Category>.from(
        (json['subcategories'] as List)
            .map((x) => Category.fromJson(x)))
        : null,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'icon': icon,
    'categoryCode': categoryCode,
    'subcategories': subcategories?.map((x) => x.toJson()).toList(),
  };
}
