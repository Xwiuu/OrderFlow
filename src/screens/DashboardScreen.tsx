// Caminho: src/screens/DashboardScreen.tsx (VERSÃO FINAL E LIMPA)

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useOrders } from "../contexts/OrdersContext";

export default function DashboardScreen() {
  // A lógica de autenticação foi movida para o header no arquivo de layout
  const { orders, isLoading } = useOrders();

  async function scheduleNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📬 Lembrete de Ordem de Serviço!",
        body: "Não se esqueça de verificar a ordem do cliente.",
      },
      trigger: { channelId: "default", seconds: 5 },
    });
    alert("Notificação agendada para daqui a 5 segundos!");
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </SafeAreaView>
    );
  }

  const pendingCount = orders.filter((o) => o.status === "Pendente").length;
  const inProgressCount = orders.filter(
    (o) => o.status === "Em Andamento"
  ).length;
  const completedCount = orders.filter((o) => o.status === "Concluído").length;

  const completedOrders = orders.filter((o) => o.status === "Concluído");
  const weeklyCounts = Array(7).fill(0);
  completedOrders.forEach((order) => {
    const dayOfWeek = new Date(order.created_at).getDay();
    if (!isNaN(dayOfWeek)) {
      weeklyCounts[dayOfWeek]++;
    }
  });
  const chartDataset = [
    weeklyCounts[1],
    weeklyCounts[2],
    weeklyCounts[3],
    weeklyCounts[4],
    weeklyCounts[5],
    weeklyCounts[6],
    weeklyCounts[0],
  ];

  const lineChartData = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [
      { data: chartDataset.length > 0 ? chartDataset : [0, 0, 0, 0, 0, 0, 0] },
    ],
  };

  const chartConfig = {
    backgroundColor: "#1e1e1e",
    backgroundGradientFrom: "#1e1e1e",
    backgroundGradientTo: "#1e1e1e",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 191, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
    propsForDots: { r: "5", strokeWidth: "2", stroke: "#00BFFF" },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* O header agora é controlado pelo _layout.tsx, então removemos daqui */}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons
              name="progress-wrench"
              size={24}
              color="#00BFFF"
            />
            <Text style={[styles.statNumber, { color: "#00BFFF" }]}>
              {inProgressCount}
            </Text>
            <Text style={styles.statLabel}>Em Andamento</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons
              name="progress-clock"
              size={24}
              color="#FFD700"
            />
            <Text style={[styles.statNumber, { color: "#FFD700" }]}>
              {pendingCount}
            </Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons
              name="progress-check"
              size={24}
              color="#32CD32"
            />
            <Text style={[styles.statNumber, { color: "#32CD32" }]}>
              {completedCount}
            </Text>
            <Text style={styles.statLabel}>Concluídas</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Ordens Concluídas na Semana</Text>
          <LineChart
            data={lineChartData}
            width={Dimensions.get("window").width - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ paddingRight: 35 }}
          />
        </View>

        <TouchableOpacity
          style={styles.customButton}
          onPress={scheduleNotification}
        >
          <Text style={styles.customButtonText}>
            AGENDAR NOTIFICAÇÃO DE TESTE
          </Text>
        </TouchableOpacity>

        {/* O botão de logout foi removido daqui e colocado no header */}
      </ScrollView>
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
  container: { padding: 16, paddingTop: 24 }, // Aumentei o padding de cima
  statsContainer: { flexDirection: "row", width: "100%" },
  statCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 6,
    minHeight: 120,
  },
  statNumber: { fontSize: 36, fontWeight: "bold", marginTop: 8 },
  statLabel: { color: "#a0a0a0", fontSize: 14, marginTop: 4 },
  chartCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    paddingVertical: 16,
    paddingLeft: 0,
    marginTop: 32,
    width: "100%",
    alignItems: "center",
  },
  chartTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "flex-start",
    paddingLeft: 16,
  },
  customButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginTop: 32,
    marginBottom: 24,
  },
  customButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
