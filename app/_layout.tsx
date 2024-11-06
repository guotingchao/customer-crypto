import { createTamagui, TamaguiProvider } from "@tamagui/core";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";
import config from "../tamagui.config";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { PortalProvider } from "tamagui";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

const tamaguiConfig = createTamagui(config);

// TypeScript types across all Tamagui APIs
type Conf = typeof tamaguiConfig;
declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends Conf {}
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <PortalProvider>
          <ToastProvider
            swipeDirection="horizontal"
            duration={6000}
            native={["mobile"]}
          >
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  title: "首页",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="encrypto/index"
                options={{ headerShown: true, title: "加密" }}
              />
              <Stack.Screen
                name="decrypto/index"
                options={{ headerShown: true, title: "解密" }}
              />

              <Stack.Screen name="+not-found" />
            </Stack>
            <ToastViewport portalToRoot />
          </ToastProvider>
        </PortalProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
