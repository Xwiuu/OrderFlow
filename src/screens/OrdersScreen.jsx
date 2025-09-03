// Caminho: src/screens/OrdersScreen.tsx (VERSÃO 100% ATUALIZADA)

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import OrderCard from "../components/OrderCard";
import { useOrders } from "../contexts/OrdersContext";

export default function OrdersScreen() {
  const { orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Ordens de Serviço</Text>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          // A única mudança está aqui: passamos o `index` para o OrderCard
          renderItem={({ item, index }) => (
            <OrderCard order={item} index={index} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }} // Aumentamos o espaço para o FAB
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="clipboard-text-off-outline"
                size={64}
                color="#3e3e3e"
              />
              <Text style={styles.emptyText}>Nenhuma ordem cadastrada</Text>
              <Text style={styles.emptySubtext}>
                {`Clique no botão '+' para criar!`}
              </Text>
            </View>
          }
        />

        <Link href="/(tabs)/new-order" asChild>
          <TouchableOpacity style={styles.fab}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#121212" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  container: { flex: 1, paddingHorizontal: 8 },
  header: {
    color: "white", // Corrigido para ser visível no fundo escuro
    fontSize: 36,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
    marginTop: "30%", // Para centralizar melhor
  },
  emptyText: {
    color: "#a0a0a0",
    fontSize: 18,
    marginTop: 16,
    fontWeight: "bold",
  },
  emptySubtext: {
    color: "#5e5e5e",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    maxWidth: "60%",
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 30,
    color: "white", // Corrigido para melhor contraste
  },
});
