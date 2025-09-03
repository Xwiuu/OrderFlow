// Caminho: src/screens/LoginScreen.tsx (VERSÃO FINAL E CORRETA)

import { Link, Stack } from "expo-router"; // Adicionado Link
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert("Erro no Login", error.message);
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: true }} />
      <View style={styles.container}>
        <Text style={styles.header}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>Faça login para continuar.</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        {/* Link para a tela de cadastro */}
        <Link href="/register" asChild>
          <Pressable style={styles.registerButton}>
            <Text style={styles.registerText}>
              Não tem uma conta?{" "}
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#121212" },
  container: { flex: 1, justifyContent: "center", padding: 24 },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    alignSelf: "center",
    marginBottom: 48,
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "white",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3e3e3e",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },

  // Estilos para o link de cadastro
  registerButton: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
    color: "gray",
  },
  registerLink: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});
