// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

User _$UserFromJson(Map<String, dynamic> json) => User(
  id: json['id'] as String,
  email: json['email'] as String,
  username: json['username'] as String,
  roles: (json['roles'] as List<dynamic>).map((e) => e as String).toList(),
  name: json['name'] as String,
  profilePicture: json['profilePicture'] as String?,
);

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
  'id': instance.id,
  'email': instance.email,
  'username': instance.username,
  'name': instance.name,
  'roles': instance.roles,
  'profilePicture': instance.profilePicture,
};
