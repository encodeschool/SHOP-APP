import 'package:json_annotation/json_annotation.dart';
part 'user_model.g.dart';

@JsonSerializable()
class User {
  final String id;
  final String email;
  final String username;
  final String name;
  final String phone;
  final List<String> roles;
  final String? profilePicture; // <-- new field

  User({
    required this.phone,
    required this.id,
    required this.email,
    required this.username,
    required this.roles,
    required this.name,
    this.profilePicture,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}

// flutter pub run build_runner watch --delete-conflicting-outputs - need to run to generate the user_model.g.dart