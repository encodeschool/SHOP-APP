import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_ru.dart';
import 'app_localizations_uz.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale) : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates = <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('ru'),
    Locale('uz')
  ];

  /// No description provided for @profileTitle.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get profileTitle;

  /// No description provided for @orderHistory.
  ///
  /// In en, this message translates to:
  /// **'Order History'**
  String get orderHistory;

  /// No description provided for @logout.
  ///
  /// In en, this message translates to:
  /// **'Logout'**
  String get logout;

  /// No description provided for @languageChanged.
  ///
  /// In en, this message translates to:
  /// **'Language changed 🇬🇧'**
  String get languageChanged;

  /// No description provided for @editProfile.
  ///
  /// In en, this message translates to:
  /// **'Edit Profile'**
  String get editProfile;

  /// No description provided for @name.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get name;

  /// No description provided for @username.
  ///
  /// In en, this message translates to:
  /// **'Username'**
  String get username;

  /// No description provided for @email.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get email;

  /// No description provided for @phone.
  ///
  /// In en, this message translates to:
  /// **'Phone'**
  String get phone;

  /// No description provided for @password.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password;

  /// No description provided for @role.
  ///
  /// In en, this message translates to:
  /// **'Role'**
  String get role;

  /// No description provided for @pleaseSelectRole.
  ///
  /// In en, this message translates to:
  /// **'Please select a role'**
  String get pleaseSelectRole;

  /// No description provided for @saveChanges.
  ///
  /// In en, this message translates to:
  /// **'Save Changes'**
  String get saveChanges;

  /// No description provided for @profileUpdated.
  ///
  /// In en, this message translates to:
  /// **'Profile updated'**
  String get profileUpdated;

  /// No description provided for @failedToLoadProfile.
  ///
  /// In en, this message translates to:
  /// **'Failed to load profile'**
  String get failedToLoadProfile;

  /// No description provided for @failedToUpdateProfile.
  ///
  /// In en, this message translates to:
  /// **'Failed to update profile'**
  String get failedToUpdateProfile;

  /// No description provided for @settings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settings;

  /// No description provided for @general.
  ///
  /// In en, this message translates to:
  /// **'General'**
  String get general;

  /// No description provided for @editUser.
  ///
  /// In en, this message translates to:
  /// **'Edit User'**
  String get editUser;

  /// No description provided for @appInfo.
  ///
  /// In en, this message translates to:
  /// **'App Info'**
  String get appInfo;

  /// No description provided for @privacyPolicy.
  ///
  /// In en, this message translates to:
  /// **'Privacy Policy'**
  String get privacyPolicy;

  /// No description provided for @appVersion.
  ///
  /// In en, this message translates to:
  /// **'App Version'**
  String get appVersion;

  /// No description provided for @home.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get home;

  /// No description provided for @shop.
  ///
  /// In en, this message translates to:
  /// **'Shop'**
  String get shop;

  /// No description provided for @profile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get profile;

  /// No description provided for @login.
  ///
  /// In en, this message translates to:
  /// **'Login'**
  String get login;

  /// No description provided for @cart.
  ///
  /// In en, this message translates to:
  /// **'Cart'**
  String get cart;

  /// No description provided for @aboutTitle.
  ///
  /// In en, this message translates to:
  /// **'About Us'**
  String get aboutTitle;

  /// No description provided for @aboutSubtitle.
  ///
  /// In en, this message translates to:
  /// **'🥩 About Us — Honest meat of a new generation'**
  String get aboutSubtitle;

  /// No description provided for @aboutDescription.
  ///
  /// In en, this message translates to:
  /// **'We created GoshtGo to change the meat buying culture in Uzbekistan. It is important for us that every family gets fresh, halal, and safe meat, without compromises or disappointments.'**
  String get aboutDescription;

  /// No description provided for @aboutStopTitle.
  ///
  /// In en, this message translates to:
  /// **'What we want to stop forever'**
  String get aboutStopTitle;

  /// No description provided for @aboutStopList.
  ///
  /// In en, this message translates to:
  /// **'We don\'t want to see:\n\n• meat wrapped in old paper at the market;\n• people touching products with bare hands;\n• flies around, ruining quality;\n• meat staying in heat for 1–2 hours in summer, losing freshness and taste;\n• customers being cheated with bones, fat or extra pieces.'**
  String get aboutStopList;

  /// No description provided for @aboutSolutionTitle.
  ///
  /// In en, this message translates to:
  /// **'Our solution'**
  String get aboutSolutionTitle;

  /// No description provided for @aboutSolutionList.
  ///
  /// In en, this message translates to:
  /// **'• Meat undergoes halal slaughter and sterile processing.\n• Each order is hermetically packed and delivered in chilled containers at no more than +4 °C.\n• The process is transparent — from receipt to delivery.\n• You always get accurate weight and honest price, without bones or extra fat.'**
  String get aboutSolutionList;

  /// No description provided for @aboutPhilosophyTitle.
  ///
  /// In en, this message translates to:
  /// **'Our philosophy'**
  String get aboutPhilosophyTitle;

  /// No description provided for @aboutPhilosophyText.
  ///
  /// In en, this message translates to:
  /// **'For us, meat is purity, respect, and trust. We want every family to know: for their money, they buy affordable, premium, and truly halal meat. We don’t just sell a product — we change consumption culture, making purchases safe, honest, and worthy of modern Tashkent. 💡 GoshtGo — new quality of meat market in Uzbekistan. From farm to kitchen, we control every step so your table always has clean, fresh, honest meat — without deception or compromises.'**
  String get aboutPhilosophyText;

  /// No description provided for @cartTitle.
  ///
  /// In en, this message translates to:
  /// **'Your Cart'**
  String get cartTitle;

  /// No description provided for @cartEmpty.
  ///
  /// In en, this message translates to:
  /// **'Your cart is empty'**
  String get cartEmpty;

  /// No description provided for @quantity.
  ///
  /// In en, this message translates to:
  /// **'Qty'**
  String get quantity;

  /// No description provided for @total.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get total;

  /// No description provided for @checkout.
  ///
  /// In en, this message translates to:
  /// **'Proceed to Checkout'**
  String get checkout;

  /// No description provided for @subcategoriesTitle.
  ///
  /// In en, this message translates to:
  /// **'Subcategories'**
  String get subcategoriesTitle;

  /// No description provided for @productsTitle.
  ///
  /// In en, this message translates to:
  /// **'Products'**
  String get productsTitle;

  /// No description provided for @checkoutTitle.
  ///
  /// In en, this message translates to:
  /// **'Checkout'**
  String get checkoutTitle;

  /// No description provided for @contactInfo.
  ///
  /// In en, this message translates to:
  /// **'Contact Information'**
  String get contactInfo;

  /// No description provided for @fullName.
  ///
  /// In en, this message translates to:
  /// **'Full Name'**
  String get fullName;

  /// No description provided for @legalEntity.
  ///
  /// In en, this message translates to:
  /// **'I am a legal entity'**
  String get legalEntity;

  /// No description provided for @companyInfo.
  ///
  /// In en, this message translates to:
  /// **'Company Information'**
  String get companyInfo;

  /// No description provided for @companyName.
  ///
  /// In en, this message translates to:
  /// **'Company Name'**
  String get companyName;

  /// No description provided for @registrationNr.
  ///
  /// In en, this message translates to:
  /// **'Registration Number'**
  String get registrationNr;

  /// No description provided for @vatNumber.
  ///
  /// In en, this message translates to:
  /// **'VAT Number'**
  String get vatNumber;

  /// No description provided for @legalAddress.
  ///
  /// In en, this message translates to:
  /// **'Legal Address'**
  String get legalAddress;

  /// No description provided for @shippingAddress.
  ///
  /// In en, this message translates to:
  /// **'Shipping Address'**
  String get shippingAddress;

  /// No description provided for @country.
  ///
  /// In en, this message translates to:
  /// **'Country'**
  String get country;

  /// No description provided for @zipCode.
  ///
  /// In en, this message translates to:
  /// **'ZIP Code'**
  String get zipCode;

  /// No description provided for @city.
  ///
  /// In en, this message translates to:
  /// **'City'**
  String get city;

  /// No description provided for @notes.
  ///
  /// In en, this message translates to:
  /// **'Order Notes'**
  String get notes;

  /// No description provided for @shippingMethod.
  ///
  /// In en, this message translates to:
  /// **'Shipping Method'**
  String get shippingMethod;

  /// No description provided for @standardShipping.
  ///
  /// In en, this message translates to:
  /// **'Standard Shipping'**
  String get standardShipping;

  /// No description provided for @expressShipping.
  ///
  /// In en, this message translates to:
  /// **'Express Shipping'**
  String get expressShipping;

  /// No description provided for @paymentMethod.
  ///
  /// In en, this message translates to:
  /// **'Payment Method'**
  String get paymentMethod;

  /// No description provided for @cardPayment.
  ///
  /// In en, this message translates to:
  /// **'Credit/Debit Card'**
  String get cardPayment;

  /// No description provided for @paypalPayment.
  ///
  /// In en, this message translates to:
  /// **'PayPal'**
  String get paypalPayment;

  /// No description provided for @codPayment.
  ///
  /// In en, this message translates to:
  /// **'Cash on Delivery'**
  String get codPayment;

  /// No description provided for @promoCode.
  ///
  /// In en, this message translates to:
  /// **'Promo Code'**
  String get promoCode;

  /// No description provided for @apply.
  ///
  /// In en, this message translates to:
  /// **'Apply'**
  String get apply;

  /// No description provided for @invalidPromo.
  ///
  /// In en, this message translates to:
  /// **'Invalid or expired promo code'**
  String get invalidPromo;

  /// No description provided for @acceptTerms.
  ///
  /// In en, this message translates to:
  /// **'I have read and accept the terms of service *'**
  String get acceptTerms;

  /// No description provided for @orderSummary.
  ///
  /// In en, this message translates to:
  /// **'Order Summary'**
  String get orderSummary;

  /// No description provided for @shipping.
  ///
  /// In en, this message translates to:
  /// **'Shipping'**
  String get shipping;

  /// No description provided for @discount.
  ///
  /// In en, this message translates to:
  /// **'Discount'**
  String get discount;

  /// No description provided for @placeOrder.
  ///
  /// In en, this message translates to:
  /// **'Place Order'**
  String get placeOrder;

  /// No description provided for @orderSuccess.
  ///
  /// In en, this message translates to:
  /// **'Order placed successfully'**
  String get orderSuccess;

  /// No description provided for @orderFailed.
  ///
  /// In en, this message translates to:
  /// **'Order failed'**
  String get orderFailed;

  /// No description provided for @loginRequired.
  ///
  /// In en, this message translates to:
  /// **'Please login to proceed with checkout'**
  String get loginRequired;

  /// No description provided for @termsRequired.
  ///
  /// In en, this message translates to:
  /// **'You must accept the terms'**
  String get termsRequired;

  /// No description provided for @userNotFound.
  ///
  /// In en, this message translates to:
  /// **'User not found. Please login again.'**
  String get userNotFound;

  /// No description provided for @paymentSuccess.
  ///
  /// In en, this message translates to:
  /// **'Payment processed successfully'**
  String get paymentSuccess;

  /// No description provided for @backHome.
  ///
  /// In en, this message translates to:
  /// **'Back to Home'**
  String get backHome;

  /// No description provided for @contactTitle.
  ///
  /// In en, this message translates to:
  /// **'Contacts'**
  String get contactTitle;

  /// No description provided for @contactSubtitle.
  ///
  /// In en, this message translates to:
  /// **'We are always happy to answer your questions, suggestions, and feedback. Contact us in any convenient way — we will respond as soon as possible.'**
  String get contactSubtitle;

  /// No description provided for @contactUs.
  ///
  /// In en, this message translates to:
  /// **'Contact Us'**
  String get contactUs;

  /// No description provided for @phoneLabel.
  ///
  /// In en, this message translates to:
  /// **'Phone'**
  String get phoneLabel;

  /// No description provided for @emailLabel.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get emailLabel;

  /// No description provided for @addressLabel.
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get addressLabel;

  /// No description provided for @formTitle.
  ///
  /// In en, this message translates to:
  /// **'Leave a request — we will call you back'**
  String get formTitle;

  /// No description provided for @nameField.
  ///
  /// In en, this message translates to:
  /// **'Your name'**
  String get nameField;

  /// No description provided for @phoneField.
  ///
  /// In en, this message translates to:
  /// **'Phone'**
  String get phoneField;

  /// No description provided for @messageField.
  ///
  /// In en, this message translates to:
  /// **'Message'**
  String get messageField;

  /// No description provided for @sendButton.
  ///
  /// In en, this message translates to:
  /// **'Send'**
  String get sendButton;

  /// No description provided for @messageSent.
  ///
  /// In en, this message translates to:
  /// **'Your message has been sent!'**
  String get messageSent;

  /// No description provided for @deliveryTitle.
  ///
  /// In en, this message translates to:
  /// **'Delivery'**
  String get deliveryTitle;

  /// No description provided for @deliveryHeader.
  ///
  /// In en, this message translates to:
  /// **'🚚 GoshtGo delivery — freshness straight to your table'**
  String get deliveryHeader;

  /// No description provided for @deliveryText1.
  ///
  /// In en, this message translates to:
  /// **'We deliver fresh meat in Tashkent with quality guarantee and punctuality.'**
  String get deliveryText1;

  /// No description provided for @standardDelivery.
  ///
  /// In en, this message translates to:
  /// **'Standard Delivery'**
  String get standardDelivery;

  /// No description provided for @standardDeliveryText.
  ///
  /// In en, this message translates to:
  /// **'• Free in Tashkent — for orders over 300,000 UZS.\n• 20,000 UZS — for orders under 300,000 UZS.\n• Minimum order amount excludes delivery cost.'**
  String get standardDeliveryText;

  /// No description provided for @expressDelivery.
  ///
  /// In en, this message translates to:
  /// **'Express Delivery'**
  String get expressDelivery;

  /// No description provided for @expressDeliveryText.
  ///
  /// In en, this message translates to:
  /// **'• 40,000 UZS — delivery on the day of order.\n• 3–5 hours — if order is placed before 18:00.\n• Payment — online by card or QR after preparation.'**
  String get expressDeliveryText;

  /// No description provided for @customDelivery.
  ///
  /// In en, this message translates to:
  /// **'Custom Solutions'**
  String get customDelivery;

  /// No description provided for @customDeliveryText.
  ///
  /// In en, this message translates to:
  /// **'Want delivery exactly on time or outside standard Tashkent zone? Contact our manager — we will adjust the route and offer the best solution.'**
  String get customDeliveryText;

  /// No description provided for @guaranteeHeader.
  ///
  /// In en, this message translates to:
  /// **'💡 GoshtGo guarantees:'**
  String get guaranteeHeader;

  /// No description provided for @guaranteeText.
  ///
  /// In en, this message translates to:
  /// **'Every order arrives fresh, neatly packaged, and on time.'**
  String get guaranteeText;

  /// No description provided for @noteHeader.
  ///
  /// In en, this message translates to:
  /// **'ℹ️ Please note'**
  String get noteHeader;

  /// No description provided for @noteText.
  ///
  /// In en, this message translates to:
  /// **'Each meat is cut manually specifically for your order to preserve taste and texture.\n\nThe final weight may differ ±10–15 %. We will inform the exact amount after preparation and agree if difference exceeds 10%.'**
  String get noteText;

  /// No description provided for @additionalGuarantee.
  ///
  /// In en, this message translates to:
  /// **'💡 GoshtGo guarantees: honesty, transparency, and taste born at cutting time.'**
  String get additionalGuarantee;

  /// No description provided for @appBenefitsHeader.
  ///
  /// In en, this message translates to:
  /// **'📱 More convenient and profitable in the GoshtGo app'**
  String get appBenefitsHeader;

  /// No description provided for @appBenefitsText.
  ///
  /// In en, this message translates to:
  /// **'• Increased cashback on all orders.\n• Easy reorder in one click.\n• Fast notifications about status and promotions.\n\nDownload GoshtGo app for iOS or Android — your favorite steak at one touch.'**
  String get appBenefitsText;

  /// No description provided for @cashbackHeader.
  ///
  /// In en, this message translates to:
  /// **'💎 Cashback for purchases'**
  String get cashbackHeader;

  /// No description provided for @cashbackText.
  ///
  /// In en, this message translates to:
  /// **'Pay via QR and receive 1% cashback from order amount. Additionally, cashback is applied to products with \'Cashback\' icon.\n\nHow to use bonuses:\n• 1 bonus = 1 UZS — can pay up to 100% of order.\n• Bonuses valid 1 year from accrual.\n• Bonuses and promo codes do not combine.\n• Check balance in GoshtGo app.\n\n💡 Every purchase — tasty and profitable.'**
  String get cashbackText;

  /// No description provided for @cardPaymentHeader.
  ///
  /// In en, this message translates to:
  /// **'💳 Payment by bank card'**
  String get cardPaymentHeader;

  /// No description provided for @cardPaymentText.
  ///
  /// In en, this message translates to:
  /// **'We accept UZCARD, HUMO, Uzum Bank, Mastercard, Visa, etc. Withdrawals only after preparation.\n\n💡 GoshtGo tip: pay by card or QR — faster, safer, and more profitable.'**
  String get cardPaymentText;

  /// No description provided for @chilledDeliveryHeader.
  ///
  /// In en, this message translates to:
  /// **'❄️ Chilled delivery — freshness under control'**
  String get chilledDeliveryHeader;

  /// No description provided for @chilledDeliveryText.
  ///
  /// In en, this message translates to:
  /// **'Orders are packed in containers below +4°C and delivered in refrigerated trucks. Even in heat, meat stays perfectly fresh.\n\n💡 GoshtGo guarantees: from factory to door — perfect freshness.'**
  String get chilledDeliveryText;

  /// No description provided for @qualityHeader.
  ///
  /// In en, this message translates to:
  /// **'🏆 Quality guarantee 100%'**
  String get qualityHeader;

  /// No description provided for @qualityText.
  ///
  /// In en, this message translates to:
  /// **'We offer only top-quality meat. If product doesn’t meet expectations — we refund 100% or replace.\n\n💡 Your peace of mind is our main quality standard.\n\n✨ GoshtGo guarantees: every purchase should delight.'**
  String get qualityText;

  /// No description provided for @appTitle.
  ///
  /// In en, this message translates to:
  /// **'GoshtGo'**
  String get appTitle;

  /// No description provided for @appSlogan.
  ///
  /// In en, this message translates to:
  /// **'Next-generation meat'**
  String get appSlogan;

  /// No description provided for @appSubtitle.
  ///
  /// In en, this message translates to:
  /// **'For us, meat is purity, respect, and trust.'**
  String get appSubtitle;

  /// No description provided for @about.
  ///
  /// In en, this message translates to:
  /// **'About'**
  String get about;

  /// No description provided for @delivery.
  ///
  /// In en, this message translates to:
  /// **'Delivery'**
  String get delivery;

  /// No description provided for @quality.
  ///
  /// In en, this message translates to:
  /// **'Quality'**
  String get quality;

  /// No description provided for @contact.
  ///
  /// In en, this message translates to:
  /// **'Contact'**
  String get contact;

  /// No description provided for @searchHint.
  ///
  /// In en, this message translates to:
  /// **'Search products...'**
  String get searchHint;

  /// No description provided for @showMore.
  ///
  /// In en, this message translates to:
  /// **'Show more'**
  String get showMore;

  /// No description provided for @beefSection.
  ///
  /// In en, this message translates to:
  /// **'Beef Meats'**
  String get beefSection;

  /// No description provided for @chickenSection.
  ///
  /// In en, this message translates to:
  /// **'Chicken Meats'**
  String get chickenSection;

  /// No description provided for @marbledSection.
  ///
  /// In en, this message translates to:
  /// **'Marbled Beef'**
  String get marbledSection;

  /// No description provided for @allProductsSection.
  ///
  /// In en, this message translates to:
  /// **'All Products'**
  String get allProductsSection;

  /// No description provided for @orderHistoryTitle.
  ///
  /// In en, this message translates to:
  /// **'My Orders'**
  String get orderHistoryTitle;

  /// No description provided for @orderNumber.
  ///
  /// In en, this message translates to:
  /// **'Order Number'**
  String get orderNumber;

  /// No description provided for @status.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get status;

  /// No description provided for @noOrders.
  ///
  /// In en, this message translates to:
  /// **'No orders yet'**
  String get noOrders;

  /// No description provided for @addProductTitle.
  ///
  /// In en, this message translates to:
  /// **'Add Product'**
  String get addProductTitle;

  /// No description provided for @titleLabel.
  ///
  /// In en, this message translates to:
  /// **'Title'**
  String get titleLabel;

  /// No description provided for @priceLabel.
  ///
  /// In en, this message translates to:
  /// **'Price'**
  String get priceLabel;

  /// No description provided for @stockLabel.
  ///
  /// In en, this message translates to:
  /// **'Stock'**
  String get stockLabel;

  /// No description provided for @conditionLabel.
  ///
  /// In en, this message translates to:
  /// **'Condition'**
  String get conditionLabel;

  /// No description provided for @conditionNew.
  ///
  /// In en, this message translates to:
  /// **'New'**
  String get conditionNew;

  /// No description provided for @conditionUsed.
  ///
  /// In en, this message translates to:
  /// **'Used'**
  String get conditionUsed;

  /// No description provided for @categoryLabel.
  ///
  /// In en, this message translates to:
  /// **'Category'**
  String get categoryLabel;

  /// No description provided for @descriptionLabel.
  ///
  /// In en, this message translates to:
  /// **'Description'**
  String get descriptionLabel;

  /// No description provided for @featuredLabel.
  ///
  /// In en, this message translates to:
  /// **'Featured'**
  String get featuredLabel;

  /// No description provided for @availableLabel.
  ///
  /// In en, this message translates to:
  /// **'Available'**
  String get availableLabel;

  /// No description provided for @selectImages.
  ///
  /// In en, this message translates to:
  /// **'Select {count} images'**
  String selectImages(Object count);

  /// No description provided for @createProduct.
  ///
  /// In en, this message translates to:
  /// **'Create Product'**
  String get createProduct;

  /// No description provided for @requiredField.
  ///
  /// In en, this message translates to:
  /// **'Required'**
  String get requiredField;

  /// No description provided for @categoryRequired.
  ///
  /// In en, this message translates to:
  /// **'Category required'**
  String get categoryRequired;

  /// No description provided for @productCreated.
  ///
  /// In en, this message translates to:
  /// **'Product added successfully'**
  String get productCreated;

  /// No description provided for @productCreateError.
  ///
  /// In en, this message translates to:
  /// **'Error creating product: {error}'**
  String productCreateError(Object error);

  /// No description provided for @productDetailTitle.
  ///
  /// In en, this message translates to:
  /// **'Product Detail'**
  String get productDetailTitle;

  /// No description provided for @pleaseLoginFavorite.
  ///
  /// In en, this message translates to:
  /// **'Please log in to use favorites.'**
  String get pleaseLoginFavorite;

  /// No description provided for @addedToFavorites.
  ///
  /// In en, this message translates to:
  /// **'Added to favorites'**
  String get addedToFavorites;

  /// No description provided for @removedFromFavorites.
  ///
  /// In en, this message translates to:
  /// **'Removed from favorites'**
  String get removedFromFavorites;

  /// No description provided for @productNotFound.
  ///
  /// In en, this message translates to:
  /// **'Product not found'**
  String get productNotFound;

  /// No description provided for @condition.
  ///
  /// In en, this message translates to:
  /// **'Condition'**
  String get condition;

  /// No description provided for @stock.
  ///
  /// In en, this message translates to:
  /// **'Stock'**
  String get stock;

  /// No description provided for @seller.
  ///
  /// In en, this message translates to:
  /// **'Seller'**
  String get seller;

  /// No description provided for @addToCart.
  ///
  /// In en, this message translates to:
  /// **'Add to Cart'**
  String get addToCart;

  /// No description provided for @addedToCart.
  ///
  /// In en, this message translates to:
  /// **'Added to cart'**
  String get addedToCart;

  /// No description provided for @support.
  ///
  /// In en, this message translates to:
  /// **'Support'**
  String get support;

  /// No description provided for @failedLoadUser.
  ///
  /// In en, this message translates to:
  /// **'Failed to load user info'**
  String get failedLoadUser;

  /// No description provided for @qualityTitle.
  ///
  /// In en, this message translates to:
  /// **'Quality'**
  String get qualityTitle;

  /// No description provided for @qualityHeader1.
  ///
  /// In en, this message translates to:
  /// **'🌿 GoshtGo — a new name in premium meat in Uzbekistan'**
  String get qualityHeader1;

  /// No description provided for @qualityText1.
  ///
  /// In en, this message translates to:
  /// **'We start today to set the future of quality. From day one, we operate with principles that make the global gastronomic market a standard: honest origin, respect for nature, and taste created by time, not haste.'**
  String get qualityText1;

  /// No description provided for @qualityHeader2.
  ///
  /// In en, this message translates to:
  /// **'Clean from farm to plate'**
  String get qualityHeader2;

  /// No description provided for @qualityText2.
  ///
  /// In en, this message translates to:
  /// **'Meat quality begins with the land on which the feed grows. Our farmer partners grow it on their own fields, free from pesticides, where animals live on open pastures, move naturally, and never encounter growth hormones, antibiotics, or appetite stimulants.'**
  String get qualityText2;

  /// No description provided for @qualityHeader3.
  ///
  /// In en, this message translates to:
  /// **'Natural rhythm'**
  String get qualityHeader3;

  /// No description provided for @qualityText3.
  ///
  /// In en, this message translates to:
  /// **'We believe great meat is not born in a hurry. Healthy animals grow in harmony and without stress, creating subtle taste, proper texture, and natural aroma unreachable with industrial methods.'**
  String get qualityText3;

  /// No description provided for @qualityHeader4.
  ///
  /// In en, this message translates to:
  /// **'Master handwork'**
  String get qualityHeader4;

  /// No description provided for @qualityText4.
  ///
  /// In en, this message translates to:
  /// **'Each delivery is select meat of young animals, delivered daily and butchered by experienced hands. This preserves texture and rich flavor valued by chefs and true gourmets.'**
  String get qualityText4;

  /// No description provided for @qualityHeader5.
  ///
  /// In en, this message translates to:
  /// **'💡 GoshtGo is more than a store.'**
  String get qualityHeader5;

  /// No description provided for @qualityText5.
  ///
  /// In en, this message translates to:
  /// **'It is a culture of responsible meat in Tashkent: from pasture to your kitchen — without compromise, intermediaries, or loss of freshness.'**
  String get qualityText5;

  /// No description provided for @skip.
  ///
  /// In en, this message translates to:
  /// **'Skip'**
  String get skip;

  /// No description provided for @next.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get next;

  /// No description provided for @get_started.
  ///
  /// In en, this message translates to:
  /// **'Get Started'**
  String get get_started;

  /// No description provided for @onboarding_title_1.
  ///
  /// In en, this message translates to:
  /// **'Welcome to Gosht Go!'**
  String get onboarding_title_1;

  /// No description provided for @onboarding_subtitle_1.
  ///
  /// In en, this message translates to:
  /// **'Your trusted marketplace for fresh meat and groceries.'**
  String get onboarding_subtitle_1;

  /// No description provided for @onboarding_title_2.
  ///
  /// In en, this message translates to:
  /// **'Buy & Sell Easily'**
  String get onboarding_title_2;

  /// No description provided for @onboarding_subtitle_2.
  ///
  /// In en, this message translates to:
  /// **'Join our community of local sellers and discover great deals.'**
  String get onboarding_subtitle_2;

  /// No description provided for @onboarding_title_3.
  ///
  /// In en, this message translates to:
  /// **'Fast & Reliable Delivery'**
  String get onboarding_title_3;

  /// No description provided for @onboarding_subtitle_3.
  ///
  /// In en, this message translates to:
  /// **'Get your orders delivered quickly right to your doorstep.'**
  String get onboarding_subtitle_3;
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) => <String>['en', 'ru', 'uz'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {


  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en': return AppLocalizationsEn();
    case 'ru': return AppLocalizationsRu();
    case 'uz': return AppLocalizationsUz();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.'
  );
}
