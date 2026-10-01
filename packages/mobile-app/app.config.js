module.exports = () => {
  const IS_UAT = process.env.APP_ENV === 'uat';

  return {
    expo: {
      name: IS_UAT ? "Test Kickstart (UAT)" : "Test Kickstart",
      slug: "test-kickstart",
      version: "1.0.0",
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
        bundleIdentifier: IS_UAT ? "com.kickstart.test.uat" : "com.kickstart.test"
      },
      android: {
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
          projectId: "YOUR_EAS_PROJECT_ID"
        }
      }
    }
  };
};
