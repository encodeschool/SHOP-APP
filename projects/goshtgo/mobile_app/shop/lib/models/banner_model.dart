class Banner {
  final String id;
  final String image;
  final String title;
  final String description;
  final String buttonText;
  final String buttonLink;

  Banner({
    required this.id,
    required this.image,
    required this.title,
    required this.description,
    required this.buttonLink,
    required this.buttonText
  });

  factory Banner.fromJson(Map<String, dynamic> json) {
    return Banner(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      image: json['image'] ?? '',
      description: json['description'] ?? '',
      buttonLink: json['buttonLink'] ?? '',
      buttonText: json['buttonText'] ?? ''
    );
  }
}