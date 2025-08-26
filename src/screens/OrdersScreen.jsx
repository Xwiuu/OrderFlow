// Caminho: src/screens/OrdersScreen.tsx (VERSÃO ESTILIZADA)

import { MaterialCommunityIcons } from "@expo/vector-icons"; // Importando ícone
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

        {/* Verificação para mostrar a mensagem de lista vazia */}
        {orders.length === 0 ? (
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
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <OrderCard order={item} index={index} />
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}

        {/* O botão flutuante continua aqui */}
        <Link href="/new-order" asChild>
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
    color: "#161616",
    fontSize: 36,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  // ESTILOS PARA A MENSAGEM DE LISTA VAZIA
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60, // Para dar espaço para o FAB
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
  },
  fabText: {
    fontSize: 30,
    color: "#121212",
    fontWeight: "bold",
  },
});
