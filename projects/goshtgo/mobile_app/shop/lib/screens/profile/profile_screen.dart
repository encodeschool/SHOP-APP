import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/auth_provider.dart';
import '../../core/locale_provider.dart';
import '../../l10n/app_localizations.dart';
import '../../services/user_service.dart';
import '../../models/user_model.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _selectedLang = 'en'; // default

  @override
  void initState() {
    super.initState();
    _loadSelectedLanguage();
  }

  Future<void> _loadSelectedLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _selectedLang = prefs.getString('locale') ?? 'en';
    });
  }

  Future<void> _changeLanguage(String lang) async {
    // Update locale provider
    await context.read<LocaleProvider>().setLocale(lang);

    setState(() {
      _selectedLang = lang;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          lang == 'uz'
              ? "Til o'zgartirildi 🇺🇿"
              : lang == 'ru'
              ? "Язык изменён 🇷🇺"
              : "Language changed 🇬🇧",
        ),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  Future<void> _logout(BuildContext context) async {
    const storage = FlutterSecureStorage();
    await storage.deleteAll(); // Clear token and userId
    context.go('/home');
  }

  Future<User?> _loadUser() async {
    final userService = UserService();
    return await userService.getUserDetails();
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(loc.profileTitle),
        actions: [
          PopupMenuButton<String>(
            tooltip: 'Select language',
            initialValue: _selectedLang,
            onSelected: _changeLanguage,
            icon: Text(
              _selectedLang == 'uz'
                  ? '🇺🇿'
                  : _selectedLang == 'ru'
                  ? '🇷🇺'
                  : '🇬🇧',
              style: const TextStyle(fontSize: 22),
            ),
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'en',
                child: Row(
                  children: [
                    Text('🇬🇧 ', style: TextStyle(fontSize: 18)),
                    SizedBox(width: 8),
                    Text('English'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'ru',
                child: Row(
                  children: [
                    Text('🇷🇺 ', style: TextStyle(fontSize: 18)),
                    SizedBox(width: 8),
                    Text('Русский'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'uz',
                child: Row(
                  children: [
                    Text('🇺🇿 ', style: TextStyle(fontSize: 18)),
                    SizedBox(width: 8),
                    Text("Oʻzbekcha"),
                  ],
                ),
              ),
            ],
          ),
          IconButton(
            icon: const Icon(Icons.support_agent),
            tooltip: 'Support',
            onPressed: () {
              context.go('/contact');
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            tooltip: 'Settings',
            onPressed: () {
              context.push('/settings');
            },
          ),
        ],
      ),
      body: FutureBuilder<User?>(
        future: _loadUser(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || snapshot.data == null) {
            return const Center(child: Text("Failed to load user info"));
          }

          final user = snapshot.data!;
          final firstLetter =
          user.name.isNotEmpty ? user.name[0].toUpperCase() : '?';

          return Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      child: Text(firstLetter),
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontSize: 18),
                          ),
                          Text(
                            user.email,
                            style: const TextStyle(color: Colors.grey),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
                const SizedBox(height: 24),

                ListTile(
                  leading: const Icon(Icons.history),
                  title: Text(loc.orderHistory),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () => context.go('/orders'),
                ),

                const Spacer(),
                ElevatedButton(
                  style: ButtonStyle(
                    backgroundColor:
                    MaterialStatePropertyAll(Colors.red[900]),
                  ),
                  onPressed: () async {
                    await context.read<AuthProvider>().logout();
                    context.go('/login');
                  },
                  child: Text(
                    loc.logout,
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
