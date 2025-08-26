// Caminho: src/screens/OrderDetailsScreen.tsx

import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOrders } from "../contexts/OrdersContext";
import { Order } from "../data/mockOrders";

const statusOptions: Order["status"][] = [
  "Pendente",
  "Em Andamento",
  "Concluído",
];
const statusColors = {
  Pendente: "#FFD700",
  "Em Andamento": "#00BFFF",
  Concluído: "#32CD32",
};

export default function OrderDetailsScreen() {
  const { orderId } = useLocalSearchParams();
  // MUDANÇA 1: Pegamos o 'isLoading' do nosso contexto
  const { orders, updateOrder, deleteOrder, isLoading } = useOrders();
  const router = useRouter();

  // MUDANÇA 2: Adicionamos a verificação de carregamento AQUI
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </SafeAreaView>
    );
  }

  // O resto do código só roda depois que o carregamento termina
  const order = orders.find((o) => o.id === orderId);

  async function handleStatusChange(newStatus: Order["status"]) {
    if (order) {
      await updateOrder(order.id, { status: newStatus });
    }
  }

  function handleDelete() {
    if (!order) return;
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a ordem de ${order.client}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteOrder(order.id);
            router.back();
          },
        },
      ]
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: true, title: "Erro" }} />
        <View style={styles.loadingContainer}>
          <Text style={styles.client}>Ordem não encontrada!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Ordem #${order.id.substring(0, 6)}...`,
          headerStyle: { backgroundColor: "#1e1e1e" },
          headerTintColor: "white",
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.client}>{order.client}</Text>
        <Text style={styles.service}>{order.service}</Text>

        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Alterar Status</Text>
          <View style={styles.statusButtonsContainer}>
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  order.status === status && {
                    backgroundColor: statusColors[status],
                    borderColor: statusColors[status],
                  },
                ]}
                onPress={() => handleStatusChange(status)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    order.status === status && { color: "#121212" },
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {order.imageUri && (
          <View style={styles.imageContainer}>
            <Text style={styles.sectionTitle}>Foto Anexada</Text>
            <Image source={{ uri: order.imageUri }} style={styles.image} />
          </View>
        )}
      </ScrollView>

      <View style={styles.actionsContainer}>
        <Link
          href={{ pathname: "/new-order", params: { orderId: order.id } }}
          asChild
        >
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>EDITAR ORDEM</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Excluir Ordem</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#121212" },
  // MUDANÇA 3: O estilo para o container de loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  scrollContainer: { padding: 16, paddingBottom: 24 },
  client: { color: "#FFFFFF", fontSize: 32, fontWeight: "bold" },
  service: { color: "#a0a0a0", fontSize: 18, marginTop: 8 },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  statusSection: { marginTop: 32 },
  statusButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3e3e3e",
    alignItems: "center",
  },
  statusButtonText: { color: "#a0a0a0", fontWeight: "bold" },
  imageContainer: { marginTop: 32 },
  image: { width: "100%", height: 250, borderRadius: 8 },
  actionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#1e1e1e",
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  editButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  deleteButton: { paddingVertical: 18, alignItems: "center" },
  deleteButtonText: { color: "#FF3B30", fontSize: 16, fontWeight: "500" },
});
