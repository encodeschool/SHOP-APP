import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/cart_provider.dart';
import '../../models/product_model.dart';
import '../../services/product_service.dart';

class ProductDetailScreen extends StatefulWidget {
  final String productId;
  const ProductDetailScreen({super.key, required this.productId});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final productService = ProductService();
  Product? _product;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadProduct();
  }

  Future<void> _loadProduct() async {
    _product = await productService.fetchProductById(widget.productId);
    setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.read<CartProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text("Product Detail")),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _product == null
          ? const Center(child: Text("Product not found"))
          : SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildImageCarousel(_product!.images),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_product!.title,
                      style: const TextStyle(
                          fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text("\$${_product!.price}",
                      style: const TextStyle(
                          fontSize: 20, color: Colors.green)),
                  const SizedBox(height: 8),
                  Text("Condition: ${_product!.condition}"),
                  const SizedBox(height: 8),
                  Text("Stock: ${_product!.stock}"),
                  const SizedBox(height: 8),
                  Text("Seller: ${_product!.user.name}"),
                  const SizedBox(height: 16),
                  Text(_product!.description),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _product == null
          ? null
          : Padding(
        padding: const EdgeInsets.all(12),
        child: ElevatedButton(
          onPressed: _product!.available && _product!.stock > 0
              ? () {
            cart.addToCart(_product!);
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("Added to cart")),
            );
          }
              : null,
          child: const Text(
              "Add to Cart",
              style: TextStyle(
                color: Colors.white
              )
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.black
          )
        ),
      ),
    );
  }

  Widget _buildImageCarousel(List<String> imageUrls) {
    return SizedBox(
      height: 280,
      child: imageUrls.isEmpty
          ? const Center(child: Icon(Icons.image, size: 100))
          : PageView.builder(
        itemCount: imageUrls.length,
        itemBuilder: (_, index) {
          return Image.network(
            'http://10.0.2.2:8080${imageUrls[index]}',
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) =>
            const Icon(Icons.broken_image),
          );
        },
      ),
    );
  }
}