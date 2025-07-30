import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class SettingScreen extends StatefulWidget {
  const SettingScreen({Key? key}) : super(key: key);

  @override
  State<SettingScreen> createState() => _SettingScreenState();
}

class _SettingScreenState extends State<SettingScreen> {
  bool isDarkMode = false;
  bool notificationsEnabled = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text("General", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          ListTile(
            leading: const Icon(Icons.edit),
            title: const Text("Edit User"),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () => context.push('/profile/edit'),
          ),
          // SwitchListTile(
          //   title: const Text("Dark Mode"),
          //   value: isDarkMode,
          //   onChanged: (val) {
          //     setState(() => isDarkMode = val);
          //     // TODO: Apply theme mode
          //   },
          //   secondary: const Icon(Icons.dark_mode),
          // ),
          // SwitchListTile(
          //   title: const Text("Notifications"),
          //   value: notificationsEnabled,
          //   onChanged: (val) {
          //     setState(() => notificationsEnabled = val);
          //     // TODO: Save notification preference
          //   },
          //   secondary: const Icon(Icons.notifications),
          // ),
          // ListTile(
          //   leading: const Icon(Icons.language),
          //   title: const Text("Language"),
          //   trailing: const Icon(Icons.arrow_forward_ios, size: 16),
          //   onTap: () {
          //     // TODO: Navigate to language selection
          //   },
          // ),
          const SizedBox(height: 20),
          const Text("App Info", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          ListTile(
            leading: const Icon(Icons.privacy_tip),
            title: const Text("Privacy Policy"),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {
              // TODO: Open privacy policy
            },
          ),
          ListTile(
            leading: const Icon(Icons.info_outline),
            title: const Text("App Version"),
            subtitle: const Text("v1.0.0"), // Optional: load dynamically
          ),
        ],
      ),
    );
  }
}
