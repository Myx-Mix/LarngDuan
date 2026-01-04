# Mobile App Guide

This project is now set up to be built as a mobile app using **Capacitor**.

## Prerequisites
- **Android Studio**: Required for building the Android app and generating the APK/AAB files.

## How to Build & Run
1. **Make Changes**: working on your code in `src/` as usual.
2. **Build Web Assets**:
   ```bash
   npm run build
   ```
   This generates the production files in the `dist` folder.
   
3. **Sync with Mobile**:
   ```bash
   npx cap sync
   ```
   This updates the `android` folder with your latest code and installs any new plugins.

4. **Open Android Project**:
   ```bash
   npx cap open android
   ```
   Alternatively, launch **Android Studio** and open the `android` folder inside this project.

5. **Generate APK**:
   - In Android Studio, go to the top menu: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - **IMPORTANT**: Make sure you select **Build APK(s)**. Do *not* select "Build Bundle(s)".
   - The file you want ends in **`.apk`**.
   - If you see a file ending in `.aab`, that is for the Google Play Store and **cannot** be installed directly on a phone.
   - The APK file will be generated (usually in `android/app/build/outputs/apk/debug/`).
   - You can copy this APK to your phone to install it.

## How to Distribute (Share the App)
To let others download the app without a USB cable:

1.  **Generate the APK**: Follow step 5 above.
2.  **Locate the File**: Go to `android/app/build/outputs/apk/debug/` and find `app-debug.apk`.
3.  **Upload It**:
    - **Google Drive / Dropbox**: Upload the `.apk` file and create a shareable link. Send this link to your phones.
    - **GitHub**: Create a "Release" in your repo and attach the `.apk` file.
    - **Website**: If you have a website, just upload the `.apk` file there.
4.  **Install on Phone**:
    - Open the link on the Android phone.
    - Download the file.
    - Tap to install (you may need to allow "Install from unknown sources").

## iOS Support (Apple)
It **does work** on Apple devices, but with a major catch: **You need a Mac.**

Apple requires **Xcode** (which only runs on macOS) to build and sign iOS apps. Since you are on Windows:
1.  **I have added the iOS configuration** to your project (folder `ios/`).
2.  To build the app for an iPhone:
    - Copy this entire project folder to a Mac.
    - Run `npm install`.
    - Run `npx cap sync`.
    - Run `npx cap open ios` (this opens Xcode).
    - In Xcode, plug in your iPhone and click the "Run" button.

### Alternatives if you don't have a Mac:
- **Cloud Build Services**: Services like Ionic Appflow or Expo Application Services (EAS) can build the iOS app for you in the cloud, but they often require paid subscriptions or complex setup.
- **Borrow a Mac**: You only need the Mac for the final build step. You can develop on Windows, and then just transfer the code to a Mac to compile it.

## Notes
- To test existing functionality on a device or emulator, simply press the **Run** (Play) button in Android Studio after opening the project.
- If you add new native features (camera, geolocation, etc.), you may need to install additional Capacitor plugins.
