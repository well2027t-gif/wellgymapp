import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "WellGym",
  slug: "wellgymapp",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "wellgymapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  platforms: ["ios", "android", "web"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "space.manus.wellgymapp",
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
    },
    package: "space.manus.wellgymapp",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
    baseUrl: "",
  },
};

export default config;
