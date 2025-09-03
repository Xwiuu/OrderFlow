// Caminho: src/components/OrderCard.tsx (VERSÃO 100% ATUALIZADA)

import { Link } from "expo-router";
import { MotiView } from "moti"; // Importamos o MotiView em vez do 'react-native-reanimated'
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Order } from "../data/mockOrders";

const statusColors = {
  Pendente: "#FFD700",
  "Em Andamento": "#00BFFF",
  Concluído: "#32CD32",
};

export default function OrderCard({
  order,
  index,
}: {
  order: Order;
  index: number;
}) {
  return (
    // O MotiView simplifica a animação. Não precisamos mais de 'useSharedValue',
    // 'useAnimatedStyle' ou 'useEffect' para a animação de entrada.
    <MotiView
      from={{ opacity: 0, translateY: 50, scale: 0.9 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: "timing",
        duration: 400,
        delay: index * 100, // Cada cartão entra com um pequeno atraso
      }}
    >
      <Link
        href={{ pathname: "/(tabs)/[orderId]", params: { orderId: order.id } }}
        asChild
      >
        <Pressable style={styles.cardContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: statusColors[order.status] || "gray" },
            ]}
          />
          <View style={styles.contentContainer}>
            <Text style={styles.clientText}>{order.client}</Text>
            <Text style={styles.serviceText}>{order.service}</Text>
            <Text
              style={[
                styles.statusText,
                { color: statusColors[order.status] || "gray" },
              ]}
            >
              {order.status}
            </Text>
          </View>
        </Pressable>
      </Link>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    overflow: "hidden",
    // Adicionando uma pequena sombra para um efeito mais profissional
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusIndicator: {
    width: 6,
  },
  contentContainer: {
    padding: 16,
    flex: 1,
  },
  clientText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceText: {
    color: "#a0a0a0",
    fontSize: 14,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 12,
    alignSelf: "flex-end",
  },
});
