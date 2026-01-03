import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:enroute/l10n/app_localizations.dart';
import '../../core/locale_provider.dart';
import '../../core/auth_provider.dart';
import '../../services/user_service.dart';
import '../../models/user_model.dart';
import 'package:go_router/go_router.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _selectedLang = 'en';

  @override
  void initState() {
    super.initState();
    final localeProvider = context.read<LocaleProvider>();
    _selectedLang = localeProvider.locale.languageCode;
  }

  Future<void> _changeLanguage(String lang) async {
    final localeProvider = context.read<LocaleProvider>();
    await localeProvider.setLocale(lang);

    setState(() => _selectedLang = lang);

    final loc = AppLocalizations.of(context)!;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(lang == 'uz'
            ? loc.languageChanged
            : lang == 'ru'
            ? loc.languageChanged
            : loc.languageChanged),
        duration: const Duration(seconds: 2),
      ),
    );
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
                child: Row(children: [Text('🇬🇧 '), SizedBox(width: 8), Text('English')]),
              ),
              const PopupMenuItem(
                value: 'ru',
                child: Row(children: [Text('🇷🇺 '), SizedBox(width: 8), Text('Русский')]),
              ),
              const PopupMenuItem(
                value: 'uz',
                child: Row(children: [Text('🇺🇿 '), SizedBox(width: 8), Text("Oʻzbekcha")]),
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
            return Center(child: Text(loc.failedLoadUser));
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
                          Text(user.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 18)),
                          Text(user.email, style: const TextStyle(color: Colors.grey)),
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
                ListTile(
                  leading: const Icon(Icons.star_sharp),
                  title: Text(loc.aiHelp),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () => context.go('/ai'),
                ),
                const Spacer(),
                ElevatedButton(
                  style: ButtonStyle(
                      backgroundColor: MaterialStatePropertyAll(Colors.red[900])),
                  onPressed: () async {
                    await context.read<AuthProvider>().logout();
                    context.go('/login');
                  },
                  child: Text(loc.logout, style: const TextStyle(color: Colors.white)),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
