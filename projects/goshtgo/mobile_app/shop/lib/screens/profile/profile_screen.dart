import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../core/auth_provider.dart';
import '../../services/user_service.dart';
import '../../models/user_model.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

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
    return Scaffold(
      appBar:  AppBar(
        title: Text('Profile'),
        actions: [
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
          final firstLetter = user.name.isNotEmpty ? user.name[0].toUpperCase() : '?';

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
                            maxLines: 1, // allows up to 2 lines
                            overflow: TextOverflow.ellipsis, // "..." if text exceeds 2 lines
                            style: const TextStyle(
                              fontSize: 18,
                            ),
                          ),
                          Text(user.email, style: const TextStyle(color: Colors.grey)),
                        ],
                      ),
                    )
                  ],
                ),
                const SizedBox(height: 24),
                // ListTile(
                //   leading: const Icon(Icons.add),
                //   title: const Text("Add Product"),
                //   trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                //   onTap: () => context.go('/add-product'),
                // ),
                ListTile(
                  leading: const Icon(Icons.history),
                  title: const Text("Order History"),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () => context.go('/orders'),
                ),
                // ListTile(
                //   leading: const Icon(Icons.message),
                //   title: const Text("Messages"),
                //   trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                //   onTap: () {
                //     // TODO: Navigate to messages
                //   },
                // ),
                // ListTile(
                //   leading: const Icon(Icons.feedback),
                //   title: const Text("Feedbacks"),
                //   trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                //   onTap: () {
                //     // TODO: Navigate to feedbacks
                //   },
                // ),
                const Spacer(),
                ElevatedButton(
                  style: ButtonStyle(
                    backgroundColor: MaterialStatePropertyAll(
                      Colors.red[900]
                    ),
                  ),
                  onPressed: () async {
                    await context.read<AuthProvider>().logout();
                    context.go('/login');
                  },
                  child: const Text(
                      "Выйти",
                      style: TextStyle(
                        color: Colors.white
                      ),
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
