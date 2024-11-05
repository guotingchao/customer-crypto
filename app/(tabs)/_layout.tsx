import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "dark"].text,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "加密/解密",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "lock-closed" : "lock-closed-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
