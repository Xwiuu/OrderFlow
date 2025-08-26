// Caminho: src/screens/NewOrderScreen.tsx (VERSÃO COM CÂMERA)

import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useOrders } from "../contexts/OrdersContext";

export default function NewOrderScreen() {
  const { orders, addOrder, updateOrder } = useOrders();
  const router = useRouter();
  const params = useLocalSearchParams();

  const orderId = params.orderId as string;
  const isEditing = !!orderId;

  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      const existingOrder = orders.find((o) => o.id === orderId);
      if (existingOrder) {
        setClient(existingOrder.client);
        setService(existingOrder.service);
        setImage(existingOrder.imageUri || null);
      }
    }
  }, [isEditing, orderId, orders]);

  async function handlePickImage() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Desculpe, precisamos de permissão para acessar a câmera!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!client || !service) {
    }

    const orderData = { client, service, imageUri: image || undefined };

    if (isEditing) {
      await updateOrder(orderId, orderData);
    } else {
      await addOrder(orderData);
    }

    router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: isEditing ? "Editar Ordem" : "Nova Ordem",
          headerShown: true,
          headerStyle: { backgroundColor: "#1e1e1e" },
          headerTintColor: "white",
        }}
      />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={client}
          onChangeText={setClient}
          placeholder="Nome do Cliente"
          placeholderTextColor="#555"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          value={service}
          onChangeText={setService}
          placeholder="Descrição do Serviço"
          placeholderTextColor="#555"
          multiline
        />

        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
          <Text style={styles.imagePickerText}>Anexar Foto da Câmera</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        <View style={{ marginTop: "auto", marginBottom: 16 }}>
          <Button
            title={isEditing ? "Salvar Alterações" : "Criar Ordem"}
            onPress={handleSave}
            color="#00BFFF"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imagePicker: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  imagePickerText: {
    color: "#00BFFF",
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 24,
    resizeMode: "cover",
  },
  safeArea: { flex: 1, backgroundColor: "#121212" },
  container: { flex: 1, padding: 16 },
  label: { color: "white", fontSize: 16, marginBottom: 8 },
  input: {
    backgroundColor: "#1e1e1e",
    color: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 24,
  },
  textArea: { height: 100, textAlignVertical: "top" },
});
