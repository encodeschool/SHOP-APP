// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Russian (`ru`).
class AppLocalizationsRu extends AppLocalizations {
  AppLocalizationsRu([String locale = 'ru']) : super(locale);

  @override
  String get profileTitle => 'Профиль';

  @override
  String get orderHistory => 'История заказов';

  @override
  String get logout => 'Выйти';

  @override
  String get languageChanged => 'Язык изменён 🇷🇺';

  @override
  String get editProfile => 'Редактировать профиль';

  @override
  String get name => 'Имя';

  @override
  String get username => 'Имя пользователя';

  @override
  String get email => 'Эл. почта';

  @override
  String get phone => 'Телефон';

  @override
  String get password => 'Пароль';

  @override
  String get role => 'Роль';

  @override
  String get pleaseSelectRole => 'Пожалуйста, выберите роль';

  @override
  String get saveChanges => 'Сохранить изменения';

  @override
  String get profileUpdated => 'Профиль обновлён';

  @override
  String get failedToLoadProfile => 'Не удалось загрузить профиль';

  @override
  String get failedToUpdateProfile => 'Ошибка обновления профиля';
}
