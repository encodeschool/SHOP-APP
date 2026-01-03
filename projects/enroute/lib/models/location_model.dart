class ProductLocation {
  final double latitude;
  final double longitude;
  final String? city;
  final String? address;

  ProductLocation({required this.latitude, required this.longitude, this.city, this.address});

  factory ProductLocation.fromJson(Map<String, dynamic> json) {
    return ProductLocation(
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      city: json['city'],
      address: json['address'],
    );
  }
}