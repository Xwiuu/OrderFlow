// Caminho: app/_layout.tsx (A VERSÃO ÚNICA E DEFINITIVA)

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, Tabs, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { OrdersProvider } from "../src/contexts/OrdersContext";
import { supabase } from "../src/lib/supabase";

// Componente para o Botão de Logout
function LogoutButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={async () => {
        await supabase.auth.signOut();
        router.replace("/login"); // Ordem direta para evitar bugs
      }}
      style={{ marginRight: 16 }}
    >
      <MaterialCommunityIcons name="logout-variant" size={28} color="gray" />
    </TouchableOpacity>
  );
}

// Componente principal que decide o que renderizar
function RootLayoutNav() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
        }}
      >
        <ActivityIndicator size="large" color="#00BFFF" />
      </View>
    );
  }

  if (!session) {
    // Se não está logado, mostra o navegador de Autenticação.
    // Ele conhece as telas de login e cadastro.
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    );
  }

  // Se está logado, mostra o app principal com as abas.
  return (
    <Tabs
      screenOptions={{
        // ESTA É A VERSÃO ESTÁVEL DA BARRA DE ABAS
        tabBarStyle: {
          backgroundColor: "#1e1e1e",
          borderTopColor: "#00BFFF",
          height: 70,
          paddingTop: 5,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "#00BFFF",
        tabBarInactiveTintColor: "gray",
        headerStyle: { backgroundColor: "#1e1e1e" },
        headerTintColor: "white",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início", // Título da aba
          headerTitle: "Dashboard", // Título do Header
          headerShown: true,
          headerRight: () => <LogoutButton />,
          // SEM tabBarIcon AQUI PARA EVITAR O BUG
        }}
      />
      <Tabs.Screen
        name="ordens"
        options={{
          title: "Ordens",
          headerShown: false,
        }}
      />
      {/* Escondemos as rotas que não são abas */}
      <Tabs.Screen name="[orderId]" options={{ href: null }} />
      <Tabs.Screen name="new-order" options={{ href: null }} />
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="register" options={{ href: null }} />
    </Tabs>
  );
}

// O Layout Raiz que prepara todos os contextos para o app
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <OrdersProvider>
          <RootLayoutNav />
        </OrdersProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
