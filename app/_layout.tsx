// Caminho: app/_layout.tsx (VERSÃO FINAL COM GRUPOS DE ROTA)
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { OrdersProvider } from "../src/contexts/OrdersContext";

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inTabsGroup = segments[0] === "(tabs)";

    if (session && !inTabsGroup) {
      // Se está logado mas não está no grupo de abas, vá para lá.
      router.replace("/" as any)
    } else if (!session && inTabsGroup) {
      // Se não está logado mas está tentando acessar o grupo de abas, vá para o login.
      router.replace("/login");
    }
  }, [session, loading, segments, router]);

  // Slot vai renderizar a rota atual (seja login, register ou o layout de abas)
  return <Slot />;
}

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
