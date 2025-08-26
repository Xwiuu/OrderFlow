// Caminho: src/components/OrderCard.tsx (VERSÃO FINAL ANIMADA)

import { Link } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Order } from "../data/mockOrders";

const statusColors = {
  Pendente: "#FFD700",
  "Em Andamento": "#00BFFF",
  Concluído: "#32CD32",
};

const OrderCard = ({ order, index }: { order: Order; index: number }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(25);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    const delay = index * 100;

    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 400 }));
  }, [index, opacity, translateY]);

  return (
    <Animated.View style={animatedCardStyle}>
      <Link href={`/${order.id}`} asChild>
        <TouchableOpacity>
          <View style={styles.cardContainer}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: statusColors[order.status] },
              ]}
            />
            <View style={styles.contentContainer}>
              <Text style={styles.clientText}>{order.client}</Text>
              <Text style={styles.serviceText}>{order.service}</Text>
              <Text
                style={[
                  styles.statusText,
                  { color: statusColors[order.status] },
                ]}
              >
                {order.status}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    overflow: "hidden",
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

export default OrderCard;
