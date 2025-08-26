// Caminho: src/lib/supabase.ts (VERSÃO FINAL PREENCHIDA)

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

// Sua URL do Projeto
const supabaseUrl = "https://tvhpjytknjphcblbkbgk.supabase.co";

// Sua chave 'anon public'
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2aHBqeXRrbmpwaGNibGJrYmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTgxNDMsImV4cCI6MjA3MTYzNDE0M30.EhfcZFzIRlOKnlCkhrl-3p6cx15Ew-EDEksvHC_0nwc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
