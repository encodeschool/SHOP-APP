import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shop/models/product_model.dart';
import 'package:shop/services/ai_service.dart';
import 'package:shop/services/product_service.dart';
import '../../l10n/app_localizations.dart';

class AIHelpScreen extends StatefulWidget {
  const AIHelpScreen({super.key});

  @override
  State<AIHelpScreen> createState() => _AIHelpScreenState();
}

class _AIHelpScreenState extends State<AIHelpScreen> {
  final TextEditingController _queryController = TextEditingController();
  String? _aiResponse;
  bool _isLoading = false;
  String? _error;

  List<Product> _availableProducts = [];
  final ProductService _productService = ProductService();

  @override
  void initState() {
    super.initState();
    _loadAvailableMeats();
  }

  Future<void> _loadAvailableMeats() async {
    try {
      final products = await _productService.fetchAllProducts();
      setState(() {
        _availableProducts =
            products.where((p) => p.categoryId.toLowerCase() == 'meat').toList();
      });
    } catch (e) {
      debugPrint('Failed to load meats: $e');
    }
  }

  Future<void> _askAI() async {
    final loc = AppLocalizations.of(context)!;
    final query = _queryController.text.trim();
    if (query.isEmpty) return;

    setState(() {
      _isLoading = true;
      _aiResponse = null;
      _error = null;
    });

    try {
      final response = await getAIResponse(query);

      final availableMeatNames = _availableProducts.map((p) => p.title.toLowerCase()).toList();
      final matchedMeats = availableMeatNames
          .where((meat) => response.toLowerCase().contains(meat))
          .toList();

      String finalResponse = response;
      if (matchedMeats.isNotEmpty) {
        finalResponse += '\n\n✅ ${loc.availableInShop}: ${matchedMeats.join(', ')}';
      } else {
        finalResponse += '\n\n⚠️ ${loc.notAvailable}';
      }

      setState(() {
        _aiResponse = finalResponse;
      });
    } catch (e) {
      setState(() {
        _error = loc.errorText;
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _queryController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(loc.aiAppBar),
        elevation: 0,
        backgroundColor: theme.scaffoldBackgroundColor,
        foregroundColor: theme.textTheme.titleLarge?.color,
        leading: IconButton(
          onPressed: () => context.go('/profile'),
          icon: const Icon(Icons.arrow_back),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: _buildResponseArea(theme, isDark),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
            child: Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    TextField(
                      controller: _queryController,
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText: loc.queryInputHint,
                        hintStyle: TextStyle(
                          color: Colors.grey[600],
                          fontStyle: FontStyle.italic,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        filled: true,
                        fillColor: isDark ? Colors.grey[800] : Colors.grey[50],
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                      ),
                      textInputAction: TextInputAction.newline,
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: _isLoading ? null : _askAI,
                        icon: _isLoading
                            ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(
                                Colors.white),
                          ),
                        )
                            : const Icon(Icons.smart_toy, size: 20),
                        label: Text(
                            _isLoading ? loc.thinking : loc.askAi),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 2,
                          backgroundColor: Colors.red[800],
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // -----------------------------------------------------------------
  // Response area
  // -----------------------------------------------------------------
  Widget _buildResponseArea(ThemeData theme, bool isDark) {
    if (_isLoading) return _buildLoadingState();
    if (_error != null) return _buildErrorState();
    if (_aiResponse != null) return _buildAIResponseBubble();
    return _buildEmptyState(theme);
  }

  Widget _buildEmptyState(ThemeData theme) {
    final loc = AppLocalizations.of(context)!;
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.restaurant_menu, size: 64, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            loc.emptyTitle,
            style: theme.textTheme.titleMedium?.copyWith(
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            loc.emptySubtitle,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: Colors.grey[500],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  List<Widget> _buildSuggestedMeats(String aiResponse) {
    final loc = AppLocalizations.of(context)!;
    final List<Widget> meatCards = [];
    for (var product in _availableProducts) {
      if (aiResponse.toLowerCase().contains(product.title.toLowerCase())) {
        meatCards.add(Card(
          child: ListTile(
            leading: product.images.isNotEmpty
                ? Image.network(product.images.first,
                width: 50, height: 50, fit: BoxFit.cover)
                : const Icon(Icons.fastfood),
            title: Text(product.title),
            subtitle: Text(loc.availableInShop),
          ),
        ));
      }
    }
    return meatCards;
  }

  Widget _buildLoadingState() {
    final loc = AppLocalizations.of(context)!;
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(
            width: 50,
            height: 50,
            child: CircularProgressIndicator(strokeWidth: 3),
          ),
          const SizedBox(height: 24),
          Text(
            loc.loadingText,
            style: TextStyle(
              fontSize: 16,
              color: Colors.deepPurple[300],
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState() {
    final loc = AppLocalizations.of(context)!;
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 56, color: Colors.red[400]),
          const SizedBox(height: 16),
          Text(
            _error!,
            style: const TextStyle(color: Colors.red, fontSize: 16),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: _askAI,
            icon: const Icon(Icons.refresh),
            label: Text(loc.retry),
          ),
        ],
      ),
    );
  }

  Widget _buildAIResponseBubble() {
    final loc = AppLocalizations.of(context)!;
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      color: Colors.deepPurple[50],
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 14,
                  backgroundColor: Colors.deepPurple,
                  child: const Text(
                    'AI',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  loc.aiAssistant,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Colors.deepPurple,
                  ),
                ),
              ],
            ),
            const Divider(height: 24),
            Expanded(
              child: SingleChildScrollView(
                child: SelectableText(
                  _aiResponse!,
                  style: const TextStyle(
                    fontSize: 15,
                    height: 1.6,
                    color: Colors.black87,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerRight,
              child: IconButton(
                icon: const Icon(Icons.copy, size: 20),
                tooltip: 'Copy',
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(loc.responseCopied)),
                  );
                },
              ),
            ),
            ..._buildSuggestedMeats(_aiResponse!),
          ],
        ),
      ),
    );
  }
}
