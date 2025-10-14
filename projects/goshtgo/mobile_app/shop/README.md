# Step 1: Prepare Your App for Release
## 1. Update your app version
- In pubspec.yaml, update:
```yaml 
version: 1.0.0+1
```
- 1.0.0 → version visible to users
- +1 → build number

## 2. Remove debug code
- Make sure you don’t have debug prints, unused code, or test features enabled.
## 3. Set app icon & name
- App icon: Use the flutter_launcher_icons package.
- App name: In android/app/src/main/AndroidManifest.xml, update 
```yaml
<application android:label="YourAppName">.
```
## 4. Set up permissions
- Only declare necessary permissions in AndroidManifest.xml.
# Step 2: Generate a Release Build
## 1. Create a signing key (one-time setup)
```bash
keytool -genkey -v -keystore ~/my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```
- Keep your keystore safe! You’ll need it for updates.
## 2. Reference the key in Gradle
- Edit android/key.properties:
```ini
storePassword=<password>
keyPassword=<password>
keyAlias=my-key-alias
storeFile=<path-to-your-keystore>
```
- Edit android/app/build.gradle:
```gradle
android {
    ...
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            shrinkResources false
        }
    }
}
```

## 3. Build the release APK or AAB
- Recommended: AAB (required for Play Store)
```bash
flutter build appbundle --release
```
- Output: build/app/outputs/bundle/release/app-release.aab
# Step 3: Create a Google Play Developer Account
1. Go to Google Play Console
2. Sign in with your Google account.
3. Pay the one-time $25 registration fee.
4. Fill out developer info.
# Step 4: Create a New App in Play Console
1. Click Create App
    - Select App name, default language, and app type (App/Game).
2. Choose Free or Paid.
3. Click Create.
# Step 5: Prepare Store Listing
1. App details
- Title, short description, full description
- Screenshots (phone, tablet, TV if applicable)
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)

2. Categorization
- Choose category (e.g., Education, Game, etc.)
- Content rating questionnaire → fill carefully

3. Contact details
- Email (required)
- Website and phone (optional)

# Step 6: Upload Release Build
1. Go to Release > Production > Create new release
2. Upload your .aab file.
3. Add release notes.
4. Save and review.

# Step 7: Complete App Content
- Privacy policy URL → required if your app collects user data.
- App content → content rating, target audience, ads, etc.

# Step 8: Publish
- Click Review and Rollout to Production → Start rollout to production
- It can take a few hours to a few days for Google to review your app.

✅ Tips:
- Test your release build on a device before uploading:
```bash
flutter install --release
```
- Use bundle (.aab) instead of APK for optimized distribution.
- Keep your keystore safe — losing it means you can’t update your app.


# Once any changes are happened We need to:
## 🧩 Step 1: Make Your Changes
Do whatever you need — update code, UI, logic, add new features, etc.
When ready to release the new version, move to the next step.
## 🧾 Step 2: Update the App Version
Open pubspec.yaml and bump the version number, for example:
``` yaml
version: 1.0.0+1
```
➡️ The first part (1.0.0) is the version name (shown to users).<br>
➡️ The second part (+1) is the version code (used by Play Store).

Important: <br>
Each update must have a higher version code than the last one.
So next time, you could set it to:
```yaml
version: 1.0.1+2
```

## 🏗️ Step 3: Build the New Release Bundle
Run:
``` bash
flutter build appbundle --release
```
This generates a new .aab file at:
``` arduino
build/app/outputs/bundle/release/app-release.aab
```

## 🔑 Step 4: Use the Same Signing Key

Always use the same keystore (my-release-key.jks) you used for the first release.
If you lose it, you won’t be able to upload updates to the same app.

## 🌐 Step 5: Upload the Update to Play Console
1. Go to Play Console
2. Select your app.
3. Go to Release > Production > Create new release.
4. Upload your new .aab file.
5. Add release notes (e.g., “Added dark mode and fixed login bug”).
6. Click Next → Review → Rollout to production.

## 🕒 Step 6: Wait for Review

Google will review your update (usually within a few hours to 1–2 days).
When approved, users with your app installed will automatically get the update.

✅ Quick Recap Checklist
| Step | Action                             |
| ---- | ---------------------------------- |
| 1    | Make your changes                  |
| 2    | Update `version` in `pubspec.yaml` |
| 3    | Build new release `.aab`           |
| 4    | Upload to Play Console (same app)  |
| 5    | Roll out update                    |


# How to change Launch icon and App Name
## 🧩 1️⃣ Change App Name
### 📍Option 1: Change manually
Open this file:
```css
android/app/src/main/AndroidManifest.xml
```
Find this line:
``` xml
<application
    android:label="old_app_name"
```
Change it to:
```xml
<application
    android:label="My New App Name"
```
That’s all for Android 🎉 <br>
If you also want to change the iOS name:
- Open ios/Runner/Info.plist
- Find:
```xml
<key>CFBundleName</key>
<string>OldAppName</string>
```
- Change to:
```xml
<key>CFBundleName</key>
<string>My New App Name</string>
```
✅ Done — your app will now show the new name on both platforms.

## 🖼️ 2️⃣ Change App Icon
The best and easiest way is with the package flutter_launcher_icons.
### Step 1: Add to your pubspec.yaml
```yaml
dev_dependencies:
  flutter_launcher_icons: ^0.13.1

flutter_launcher_icons:
  android: "launcher_icon"
  ios: true
  image_path: "assets/icon/app_icon.png"
```
- Replace the image path with your own icon path (usually assets/icon/app_icon.png).
- Recommended icon size: 1024x1024 px, square, no transparency issues.

### Step 2: Run the command
```bash
flutter pub get
flutter pub run flutter_launcher_icons
```
It will automatically generate all the required icon sizes and replace the default ones in Android and iOS projects. 🪄

## 🔁 Optional – Change App Label in Launcher (Gradle build config)
If you want, you can also set your name in android/app/build.gradle:
```gradle
defaultConfig {
    applicationId "com.example.myapp"
    resValue "string", "app_name", "My New App Name"
}
```

Then in AndroidManifest.xml:
```xml
<application android:label="@string/app_name" ... >
```
This makes it easier to change later via Gradle rather than editing XML directly.
## 🧹 3️⃣ Clean and Rebuild
After changing the name or icon, always run:
```bash
flutter clean
flutter pub get
flutter run
```
| Task               | File                             | Example                                  |
| ------------------ | -------------------------------- | ---------------------------------------- |
| App Name (Android) | `AndroidManifest.xml`            | `android:label="My App"`                 |
| App Name (iOS)     | `Info.plist`                     | `<string>My App</string>`                |
| App Icon           | `flutter_launcher_icons` package | `image_path: "assets/icon/app_icon.png"` |
