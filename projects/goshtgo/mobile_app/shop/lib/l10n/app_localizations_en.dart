// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get profileTitle => 'Profile';

  @override
  String get orderHistory => 'Order History';

  @override
  String get logout => 'Logout';

  @override
  String get languageChanged => 'Language changed 🇬🇧';

  @override
  String get editProfile => 'Edit Profile';

  @override
  String get name => 'Name';

  @override
  String get username => 'Username';

  @override
  String get email => 'Email';

  @override
  String get phone => 'Phone';

  @override
  String get password => 'Password';

  @override
  String get role => 'Role';

  @override
  String get pleaseSelectRole => 'Please select a role';

  @override
  String get saveChanges => 'Save Changes';

  @override
  String get profileUpdated => 'Profile updated';

  @override
  String get failedToLoadProfile => 'Failed to load profile';

  @override
  String get failedToUpdateProfile => 'Failed to update profile';
}
