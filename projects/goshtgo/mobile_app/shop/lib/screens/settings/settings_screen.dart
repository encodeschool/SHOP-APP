import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shop/l10n/app_localizations.dart';
import 'package:package_info_plus/package_info_plus.dart';

class SettingScreen extends StatefulWidget {
  const SettingScreen({Key? key}) : super(key: key);

  @override
  State<SettingScreen> createState() => _SettingScreenState();
}

class _SettingScreenState extends State<SettingScreen> {
  bool isDarkMode = false;
  bool notificationsEnabled = true;

  String _appVersion = '';

  @override
  void initState() {
    super.initState();
    _loadAppVersion();
  }

  Future<void> _loadAppVersion() async {
    final info = await PackageInfo.fromPlatform();
    setState(() {
      _appVersion = 'v${info.version}+${info.buildNumber}';
    });
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(loc.settings),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(loc.general, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          ListTile(
            leading: const Icon(Icons.edit),
            title: Text(loc.editUser),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () => context.push('/profile/edit'),
          ),

          const SizedBox(height: 20),
          Text(loc.appInfo, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          ListTile(
            leading: const Icon(Icons.privacy_tip),
            title: Text(loc.privacyPolicy),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {
              // TODO: Open privacy policy
            },
          ),
          ListTile(
            leading: const Icon(Icons.info_outline),
            title: Text(loc.appVersion),
            subtitle: Text(_appVersion.isEmpty ? 'Loading...' : _appVersion),
          ),
        ],
      ),
    );
  }
}
