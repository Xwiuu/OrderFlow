// Caminho: src/navigation/CustomTabBar.tsx (VERSÃO FINAL)

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 1. Definimos um "molde" para as props que nossos ícones recebem
interface IconProps {
  focused: boolean;
  color: string;
  size: number;
}

const TABS = {
  index: {
    label: "Início",
    // 2. Usamos o "molde" para dizer ao TypeScript o formato das props
    icon: (props: IconProps) => (
      <MaterialCommunityIcons
        name={props.focused ? "view-dashboard" : "view-dashboard-outline"}
        {...props} // Passamos todas as props (color, size, focused) para o ícone
      />
    ),
  },
  ordens: {
    label: "Ordens",
    // 2. Usamos o "molde" aqui também
    icon: (props: IconProps) => (
      <Ionicons
        name={props.focused ? "list-circle" : "list-circle-outline"}
        {...props}
      />
    ),
  },
};

type TabName = keyof typeof TABS;

export function CustomTabBar() {
  const segments = useSegments();
  const router = useRouter();
  // Define a aba ativa baseada no primeiro segmento da URL
  const activeTab = (segments[0] || "index") as TabName;

  return (
    <View style={styles.tabBarContainer}>
      {Object.keys(TABS).map((name) => {
        const tabName = name as TabName;
        const isFocused = activeTab === tabName;
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
    borderTopColor: "#00BFFF",
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
