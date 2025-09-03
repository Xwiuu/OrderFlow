// Caminho: app/register.tsx (VERSÃO COM ESTILO CORRETO)

import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { supabase } from "../src/lib/supabase"; // Verifique se o caminho está correto

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      Alert.alert("Erro no Cadastro", error.message);
    } else {
      Alert.alert(
        "Cadastro Realizado!",
        "Um e-mail de confirmação foi enviado. Por favor, verifique sua caixa de entrada.",
        [{ text: "OK", onPress: () => router.push("/login") }]
      );
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Criar Conta</Text>
        <Text style={styles.subtitle}>Junte-se ao OrderFlow.</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor="#888"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
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
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        <Link href="/login" asChild>
          <Pressable style={styles.loginButton}>
            <Text style={styles.loginText}>
              Já tem uma conta? <Text style={styles.loginLink}>Faça Login</Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

// Estilos copiados do seu LoginScreen para manter a consistência
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
  loginButton: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    color: "gray",
  },
  loginLink: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});
