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

## 2. Firebase Hosting Setup ✅ (Completed)
Firebase Hosting and GitHub Actions CI/CD have already been successfully configured for the `test-kickstart` project. The web portal will automatically deploy when changes are pushed to GitHub.

## 3. Expo Mobile App & EAS Config ✅ (Completed)
The Expo mobile application has been successfully linked to EAS Project `80a88dc0-728b-4efe-a5a5-0f7eee4e7588`. 
The `EXPO_TOKEN` repository secret has been configured in GitHub, so automated Android and iOS builds will trigger automatically via GitHub Actions!

### Running locally
```bash
cd packages/mobile-app

# Install dependencies (only needed once)
npm install

# Start the dev server in Production mode
npm start

# Or start it in UAT mode (loads UAT environment URL)
APP_ENV=uat npm start
```
