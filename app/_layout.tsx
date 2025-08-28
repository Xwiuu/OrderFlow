// Caminho: app/_layout.tsx (VERSÃO DE TESTE DIRETO)
import "react-native-gesture-handler";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../src/contexts/AuthContext";
import { OrdersProvider } from "../src/contexts/OrdersContext";
import { supabase } from "../src/lib/supabase";

// Este é o componente raiz que envolve tudo
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <OrdersProvider>
          {/* AQUI ESTÁ A MUDANÇA: Renderizamos as abas DIRETAMENTE */}
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
            <Tabs.Screen name="register" options={{ href: null }} />
            <Tabs.Screen name="login" options={{ href: null }} />
          </Tabs>
        </OrdersProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
