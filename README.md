# Test Kickstart - Setup Guide

Welcome to your generated monorepo! This repository contains all three layers of your application.

## Directory Structure
- `packages/apps-script/`: Google Apps Script backend and HTML views.
- `packages/web-portal/`: Web wrapper site.
- `packages/mobile-app/`: Expo React Native app shell.

## 1. Setup Google Apps Script
1. Go to [script.google.com](https://script.google.com) and create TWO projects (one for PROD, one for UAT).
2. For each project, copy the Script ID from Project Settings.
3. In this repo, update `packages/web-portal/index.html` with your new Script IDs.
4. Set up `clasp`:
   ```bash
   yarn global add @google/clasp
   clasp login
   ```
5. Push code to Apps Script:
   ```bash
   cd packages/apps-script
   clasp clone <YOUR_PROD_SCRIPT_ID>
   clasp push
   ```
6. Deploy each Apps Script as a Web App (Execute as: You, Access: Anyone).

## 2. Firebase Hosting Setup ✅ (Completed)
Firebase Hosting and GitHub Actions CI/CD have already been successfully configured for the `test-kickstart` project. The web portal will automatically deploy when changes are pushed to GitHub.

## 3. Expo Mobile App & EAS Config ✅ (Completed)
The Expo mobile application has been successfully linked to EAS Project `80a88dc0-728b-4efe-a5a5-0f7eee4e7588`. 
The `EXPO_TOKEN` repository secret has been configured in GitHub, so automated Android and iOS builds will trigger automatically via GitHub Actions!

### Android Keystore Initialization
For EAS cloud builds to succeed **non-interactively** in GitHub Actions, Expo needs an Android Keystore. You must run your first build locally to allow EAS to generate and store one:
```bash
cd packages/mobile-app
eas build --platform android --profile uat
```
*(Follow the prompts to let EAS generate a new keystore).*

### CI/CD App Versioning & Workflows
This repository includes a unified `build-mobile-app.yml` GitHub Actions workflow that handles semantic versioning and artifact releases automatically!
- **Cloud vs Local Builds:** You can trigger builds manually via the GitHub Actions UI and select `cloud` (EAS) or `local` (GitHub Runner).
- **Artifacts:** Builds are automatically packaged (APK & IPA) and published to GitHub Releases.
- **Versioning:** The workflow reads the base version from `package.json` and dynamically sets `APP_VERSION` and `APP_BUILD_NUMBER` (tied to the GitHub run number) during the build process.

### Running locally
```bash
cd packages/mobile-app

# Install dependencies (only needed once)
yarn install

# Start the dev server in Production mode
yarn start

# Or start it in UAT mode (loads UAT environment URL)
APP_ENV=uat yarn start
```
