// Caminho: app/(tabs)/_layout.tsx

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { supabase } from "../../src/lib/supabase"; // Atenção ao caminho, adicionamos ../

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#1e1e1e",
          borderTopColor: "#00BFFF",
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "#00BFFF",
        tabBarInactiveTintColor: "gray",
        headerStyle: { backgroundColor: "#121212" },
        headerTintColor: "#FFFFFF",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => supabase.auth.signOut()}
            style={{ marginRight: 16 }}
          >
            <MaterialCommunityIcons
              name="logout-variant"
              size={28}
              color="gray"
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ordens"
        options={{
          title: "Ordens de Serviço",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="format-list-bulleted"
              color={color}
              size={size}
            />
          ),
        }}
      />
      {/* Telas que não aparecem na barra de abas */}
      <Tabs.Screen
        name="new-order"
        options={{ href: null, title: "Nova Ordem" }}
      />
      <Tabs.Screen
        name="[orderId]"
        options={{ href: null, title: "Detalhes da Ordem" }}
      />
    </Tabs>
  );
}
