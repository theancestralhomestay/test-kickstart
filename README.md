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
   npm install -g @google/clasp
   clasp login
   ```
5. Push code to Apps Script:
   ```bash
   cd packages/apps-script
   clasp clone <YOUR_PROD_SCRIPT_ID>
   clasp push
   ```
6. Deploy each Apps Script as a Web App (Execute as: You, Access: Anyone).

## 2. Firebase Hosting Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project.
2. In your terminal, initialize GitHub Actions integration automatically:
   ```bash
   cd packages/web-portal
   npm install -g firebase-tools
   firebase login
   firebase init hosting:github
   ```
3. Follow the CLI prompts. The Firebase CLI will automatically create a highly secure Service Account, bind it to your GitHub repository via Secrets, and generate a new modern GitHub Actions workflow file in your repo!

## 3. Expo Mobile App & EAS Config

1. Create a project on the [Expo Dashboard](https://expo.dev) or log in via CLI.
2. Initialize and configure EAS:
   ```bash
   cd packages/mobile-app
   npm install -g eas-cli
   npm install
   eas login
   eas init --id YOUR_EAS_PROJECT_ID
   ```
   *(Be sure to update `app.config.js` with your generated `projectId` if `eas init` doesn't do it automatically).*
3. Generate an Expo Access Token in your Expo account settings and add it as a GitHub Repository Secret named `EXPO_TOKEN`. This is required for the automated EAS Cloud Builds.

### Running locally
```bash
# Start the dev server in Production mode
npm start

# Or start it in UAT mode (loads UAT environment URL)
APP_ENV=uat npm start
```
