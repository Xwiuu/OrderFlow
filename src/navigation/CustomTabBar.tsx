// Caminho: src/navigation/CustomTabBar.tsx (VERSÃO CORRIGIDA)

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"; // Importação chave
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TABS = {
  index: {
    label: "Início",
    icon: (props: any) => (
      <MaterialCommunityIcons
        name={props.focused ? "view-dashboard" : "view-dashboard-outline"}
        {...props}
      />
    ),
  },
  ordens: {
    label: "Ordens",
    icon: (props: any) => (
      <Ionicons
        name={props.focused ? "list-circle" : "list-circle-outline"}
        {...props}
      />
    ),
  },
};

type TabName = keyof typeof TABS;

// Agora usamos o tipo `BottomTabBarProps` para que o TypeScript não reclame
export function CustomTabBar({ state }: BottomTabBarProps) {
  const router = useRouter();
  const activeRoute = state.routes[state.index].name as TabName;

  return (
    <View style={styles.tabBarContainer}>
      {Object.keys(TABS).map((name) => {
        const tabName = name as TabName;
        const isFocused = activeRoute === tabName;
        const color = isFocused ? "#00BFFF" : "gray";
        const Icon = TABS[tabName].icon;

        return (
          <TouchableOpacity
            key={tabName}
            style={styles.tabButton}
            onPress={() =>
              router.push(`/${tabName === "index" ? "" : tabName}`)
            }
          >
            <Icon color={color} size={28} focused={isFocused} />
            <Text style={[styles.tabLabel, { color }]}>
              {TABS[tabName].label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    height: 80,
    backgroundColor: "#1e1e1e",
    borderTopWidth: 1,
    borderTopColor: "#2d2d2d",
    paddingBottom: 10,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
