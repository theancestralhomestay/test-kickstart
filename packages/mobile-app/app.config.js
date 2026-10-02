const packageJson = require("./package.json");

module.exports = () => {
  const IS_UAT = process.env.APP_ENV === 'uat';
  const appVersion = process.env.APP_VERSION || packageJson.version || "1.0.0";
  const buildNumber = process.env.APP_BUILD_NUMBER || "1";
  const versionCode = parseInt(buildNumber, 10) || 1;

  return {
    expo: {
      name: IS_UAT ? "Test Kickstart (UAT)" : "Test Kickstart",
      slug: "test-kickstart",
      version: appVersion,
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "automatic",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: IS_UAT ? "com.kickstart.test.uat" : "com.kickstart.test",
        buildNumber: String(buildNumber)
      },
      android: {
        versionCode: versionCode,
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#ffffff"
        },
        package: IS_UAT ? "com.kickstart.test.uat" : "com.kickstart.test"
      },
      web: {
        favicon: "./assets/favicon.png"
      },
      extra: {
        env: IS_UAT ? 'uat' : 'prod',
        eas: {
          projectId: "80a88dc0-728b-4efe-a5a5-0f7eee4e7588"
        }
      },
      owner: "test-kickstart"
    }
  };
};
