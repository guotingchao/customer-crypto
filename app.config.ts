export default {
  expo: {
    name: "cyrpto-customer",
    displayName: "cyrpto-customer",
    slug: "cyrpto",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "crypto",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.guozichun.cryptoCustomer",
    },
    plugins: ["expo-router", "expo-font"],
    experiments: {
      typedRoutes: true,
    },
  },
};
