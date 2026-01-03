import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';

import '../../l10n/app_localizations.dart';
import '../../models/product_model.dart';
import '../../services/product_service.dart';
import '../../widgets/product_bottom_sheet.dart';
import '../../widgets/product_card.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  LatLng? _currentLocation;
  LatLng? _selectedLocation;
  bool _loading = true;
  String? _error;
  bool _searching = false;
  Timer? _debounce;
  List<Product> _searchResults = [];
  final productService = ProductService();
  final TextEditingController _searchController = TextEditingController();

  List<Product> _products = [];
  bool _productsLoading = true;

  final MapController _mapController = MapController();

  @override
  void initState() {
    super.initState();
    _loadProducts();
    _getUserLocation();
  }

  Future<void> _loadProducts() async {
    try {
      final results = await productService.fetchAllProducts();
      setState(() {
        _products = results.where((p) => p.location != null).toList();
        _productsLoading = false;
      });
      print('Loaded ${_products.length} products with locations');

      if (_products.isNotEmpty) {
        _fitMapToProducts();
      }
    } catch (e) {
      setState(() {
        _productsLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to load products: $e"))
      );
    }
  }

  void _fitMapToProducts() {
    if (_products.isEmpty) return;

    double? minLat, maxLat, minLng, maxLng;

    for (var product in _products) {
      final lat = product.location!.latitude;
      final lng = product.location!.longitude;

      minLat = minLat == null ? lat : (lat < minLat ? lat : minLat);
      maxLat = maxLat == null ? lat : (lat > maxLat ? lat : maxLat);
      minLng = minLng == null ? lng : (lng < minLng ? lng : minLng);
      maxLng = maxLng == null ? lng : (lng > maxLng ? lng : maxLng);
    }

    if (minLat != null && maxLat != null && minLng != null && maxLng != null) {
      final bounds = LatLngBounds(
        LatLng(minLat, minLng),
        LatLng(maxLat, maxLng),
      );
      _mapController.fitCamera(CameraFit.bounds(bounds: bounds, padding: const EdgeInsets.all(50)));
    }
  }

  void _zoomIn() {
    final zoom = _mapController.camera.zoom + 1;
    _mapController.move(_mapController.camera.center, zoom);
  }

  void _zoomOut() {
    final zoom = _mapController.camera.zoom - 1;
    _mapController.move(_mapController.camera.center, zoom);
  }

  void _onSearchChanged(String query) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () async {
      if (query.isEmpty) {
        setState(() => _searchResults.clear());
        return;
      }

      setState(() => _searching = true);
      try {
        final results = await productService.searchProducts(query);
        if (mounted) {
          setState(() {
            _searchResults = results;
            _searching = false;
          });
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context)
              .showSnackBar(SnackBar(content: Text('Search failed: $e')));
          setState(() => _searching = false);
        }
      }
    });
  }

  Future<void> _getUserLocation() async {
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) throw 'Location service disabled';

      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }

      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        throw 'Location permission denied';
      }

      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      final latLng = LatLng(position.latitude, position.longitude);

      setState(() {
        _currentLocation = latLng;
        _selectedLocation = latLng;
        _loading = false;
      });

      /// ✅ SAFE: move map AFTER render
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          _mapController.move(latLng, 15);
        }
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }


  /// 🔄 Re-center GPS
  void _recenter() {
    if (_currentLocation == null) return;
    _mapController.move(_currentLocation!, 15);
    setState(() {
      _selectedLocation = _currentLocation;
    });
  }

  /// 💾 Save location to backend
  Future<void> _confirmLocation() async {
    if (_selectedLocation == null) return;

    final response = await http.post(
      Uri.parse('https://your-backend.com/api/location'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'latitude': _selectedLocation!.latitude,
        'longitude': _selectedLocation!.longitude,
      }),
    );

    if (!mounted) return;

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Location saved')),
      );
      Navigator.pop(context, _selectedLocation);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to save location')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final mapKey = dotenv.env['MAP_KEY'] ?? '';
    final loc = AppLocalizations.of(context)!;
    final primaryColor = Colors.red[900];

    if (_loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_error != null) {
      return Scaffold(
        body: Center(
          child: Text(_error!, style: const TextStyle(color: Colors.red)),
        ),
      );
    }



    return Scaffold(
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: _selectedLocation!,
              initialZoom: 15,
              onTap: (_, point) {
                setState(() {
                  _selectedLocation = point;
                });
              },
            ),
            children: [
              TileLayer(
                urlTemplate:
                'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=$mapKey',
                userAgentPackageName: 'uz.enroute.enroute',
              ),
              MarkerLayer(
                markers: [
                  // Optional: current user location marker
                  if (_currentLocation != null)
                    Marker(
                      point: _currentLocation!,
                      width: 40,
                      height: 40,
                      child: Icon(Icons.my_location, color: Colors.blue, size: 40),
                    ),

                  // Product markers
                  ..._products.map((product) {
                    return Marker(
                      point: LatLng(
                        product.location!.latitude,
                        product.location!.longitude,
                      ),
                      width: 80,
                      height: 80,
                      child: GestureDetector(
                        onTap: () {
                          // Optional: show product details or bottom sheet
                          showModalBottomSheet(
                            context: context,
                            builder: (_) => ProductBottomSheet(product: product),
                          );
                        },
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // Product title
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(8),
                                boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 4)],
                              ),
                              child: Text(
                                product.title,
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(height: 4),
                            // Product image
                            ClipRRect(
                              borderRadius: BorderRadius.circular(25),
                              child: Image.network(
                                product.images.isNotEmpty ? '${dotenv.env["API_URL"]}${product.images[0]}' : 'https://via.placeholder.com/50',
                                width: 50,
                                height: 50,
                                fit: BoxFit.cover,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ],
          ),

          /// 🔄 Re-center button
          Positioned(
            right: 16,
            bottom: 110,
            child: FloatingActionButton(
              heroTag: 'gps',
              onPressed: _recenter,
              child: const Icon(Icons.my_location),
            ),
          ),

          /// ✅ Confirm button
          Positioned(
            left: 16,
            right: 16,
            bottom: 40,
            child: ElevatedButton(
              onPressed: _confirmLocation,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Confirm location',
                style: TextStyle(fontSize: 16),
              ),
            ),
          ),

          Positioned(
            right: 16,
            bottom: 180,
            child: Column(
              children: [
                FloatingActionButton(
                  heroTag: 'zoom_in',
                  mini: true,
                  onPressed: _zoomIn,
                  child: const Icon(Icons.add),
                ),
                const SizedBox(height: 8),
                FloatingActionButton(
                  heroTag: 'zoom_out',
                  mini: true,
                  onPressed: _zoomOut,
                  child: const Icon(Icons.remove),
                ),
              ],
            ),
          ),


          // Back button
          Positioned(
            top: 40,
            left: 16,
            child: Material(
              elevation: 4,
              borderRadius: BorderRadius.circular(12),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                child: FloatingActionButton(
                  mini: true,
                  heroTag: 'back_button',
                  backgroundColor: Colors.white,
                  elevation: 0,
                  onPressed: () => context.go("/home"),
                  child: Icon(Icons.arrow_back, color: primaryColor),
                ),
              ),
            ),
          ),

          // Search bar
          Positioned(
            left: 100, // leave space for back button
            right: 16,
            top: 40,
            child: Material(
              elevation: 4,
              borderRadius: BorderRadius.circular(12),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                child: Row(
                  children: [
                    Icon(Icons.search, color: primaryColor),
                    const SizedBox(width: 6),
                    Expanded(
                      child: TextField(
                        controller: _searchController,
                        decoration: InputDecoration(
                          hintText: loc.searchHint,
                          border: InputBorder.none,
                        ),
                        onChanged: _onSearchChanged,
                      ),
                    ),
                    if (_searching)
                      const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      ),
                    if (_searchController.text.isNotEmpty && !_searching)
                      IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchResults.clear());
                        },
                      ),
                  ],
                ),
              ),
            ),
          ),

          if (_searchResults.isNotEmpty)
            Positioned(
              left: 16,
              right: 16,
              top: 110,
              child: Material(
                elevation: 6,
                borderRadius: BorderRadius.circular(12),
                child: SizedBox(
                  height: 200,
                  child: ListView.builder(
                    itemCount: _searchResults.length,
                    itemBuilder: (context, index) {
                      return ProductCard(
                        product: _searchResults[index],
                      );
                    },
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
