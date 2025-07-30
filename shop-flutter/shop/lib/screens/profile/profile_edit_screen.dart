import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../services/user_service.dart';

class ProfileEditScreen extends StatefulWidget {
  const ProfileEditScreen({super.key});

  @override
  State<ProfileEditScreen> createState() => _ProfileEditScreenState();
}

class _ProfileEditScreenState extends State<ProfileEditScreen> {
  final _formKey = GlobalKey<FormState>();
  final _userService = UserService();

  String _name = '';
  String _email = '';
  String _phone = '';
  String _username = '';
  String _password = '';
  String? _profilePictureUrl;
  bool _loading = true;

  List<String> _availableRoles = ['SELLER', 'ADMIN', 'BUYER'];
  List<String> _selectedRoles = [];

  File? _image;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() => _image = File(pickedFile.path));
    }
  }

  Future<void> _loadUserData() async {
    try {
      final data = await _userService.fetchUserProfile();
      setState(() {
        _name = data['name'] ?? '';
        _email = data['email'] ?? '';
        _phone = data['phone'] ?? '';
        _username = data['username'] ?? '';
        _password = data['password'] ?? '';
        _selectedRoles = List<String>.from(data['roles'] ?? []);
        _profilePictureUrl = data['profilePictureUrl'];
        _loading = false;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to load profile: $e")),
      );
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();
    try {
      await _userService.updateUserProfile({
        "name": _name,
        "phone": _phone,
        "username": _username,
        "email": _email,
        "password": _password,
        "roles": _selectedRoles,
      }, _image);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Profile updated")),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to update: $e")),
      );
    }
  }

  Widget _buildProfileImage() {
    if (_image != null) {
      return CircleAvatar(
        radius: 50,
        backgroundImage: FileImage(_image!),
      );
    } else if (_profilePictureUrl != null && _profilePictureUrl!.isNotEmpty) {
      return CircleAvatar(
        radius: 50,
        backgroundImage: NetworkImage('http://10.0.2.2:8080${_profilePictureUrl}'),
      );
    } else {
      return const CircleAvatar(
        radius: 50,
        backgroundImage: AssetImage('assets/images/panda.png'),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Edit Profile")),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              Column(
                children: [
                  GestureDetector(
                    onTap: _pickImage,
                    child: Stack(
                      children: [
                        _buildProfileImage(),
                        const Positioned(
                          bottom: 0,
                          right: 4,
                          child: CircleAvatar(
                            radius: 14,
                            backgroundColor: Colors.white,
                            child: Icon(Icons.edit, size: 18, color: Colors.black),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
              TextFormField(
                initialValue: _name,
                decoration: const InputDecoration(labelText: 'Name'),
                onSaved: (value) => _name = value ?? '',
              ),
              TextFormField(
                initialValue: _username,
                decoration: const InputDecoration(labelText: 'Username'),
                onSaved: (value) => _username = value ?? '',
              ),
              TextFormField(
                initialValue: _email,
                keyboardType: TextInputType.emailAddress,
                enabled: false,
                decoration: const InputDecoration(labelText: 'Email'),
              ),
              TextFormField(
                initialValue: _phone,
                decoration: const InputDecoration(labelText: 'Phone'),
                keyboardType: TextInputType.phone,
                onSaved: (value) => _phone = value ?? '',
              ),
              TextFormField(
                // Remove this line: initialValue: _password,
                decoration: const InputDecoration(labelText: 'Password'),
                keyboardType: TextInputType.visiblePassword,
                obscureText: true,
                onSaved: (value) => _password = value ?? '',
              ),
              DropdownButtonFormField<String>(
                value: _selectedRoles.isNotEmpty ? _selectedRoles.first : null,
                decoration: const InputDecoration(labelText: 'Role'),
                items: _availableRoles.map((role) {
                  return DropdownMenuItem<String>(
                    value: role,
                    child: Text(role),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedRoles = value != null ? [value] : [];
                  });
                },
                validator: (value) => value == null ? 'Please select a role' : null,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _save,
                child: const Text(
                    "Save Changes",
                    style: TextStyle(
                      color: Colors.white
                    )
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black
                )
              )
            ],
          ),
        ),
      ),
    );
  }
}
