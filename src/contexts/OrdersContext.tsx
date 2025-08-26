// Caminho: src/contexts/OrdersContext.tsx

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Order } from "../data/mockOrders";
import { supabase } from "../lib/supabase";

interface OrderData {
  client: string;
  service: string;
  imageUri?: string;
}

interface OrdersContextData {
  orders: Order[];
  addOrder: (data: OrderData) => Promise<void>;
  updateOrder: (
    orderId: string,
    data: Partial<Omit<Order, "id" | "created_at">>
  ) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  isLoading: boolean;
}

const OrdersContext = createContext<OrdersContextData>({} as OrdersContextData);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadOrdersFromDB() {
      setIsLoading(true);
      // VVVV MUDANÇA AQUI VVVV
      // Trocamos o select('*') por uma lista explícita de colunas
      const { data, error } = await supabase
        .from("orders")
        .select("id, client, service, status, imageUri, created_at")
        .order("created_at", { ascending: false }); // Agora podemos ordenar de novo!

      if (error) {
        console.error("Erro ao buscar as ordens:", error);
        alert("Não foi possível carregar as ordens de serviço.");
      } else {
        setOrders(data as Order[]);
      }
      setIsLoading(false);
    }
    loadOrdersFromDB();
  }, []);

  const addOrder = async (orderData: OrderData) => {
    const newOrderPayload = {
      ...orderData, // Pega os dados do formulário (cliente, serviço, imagem)
      status: "Pendente",
      // Criamos a data no formato ISO que o Supabase entende
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("orders")
      .insert([newOrderPayload])
      // VVVV MUDANÇA AQUI VVVV
      .select("id, client, service, status, imageUri, created_at");

    if (error) {
      console.error("Erro ao adicionar ordem:", error.message);
      alert("Não foi possível criar a nova ordem.");
    } else if (data) {
      setOrders((currentOrders) => [data[0] as Order, ...currentOrders]);
    }
  };

  const updateOrder = async (
    orderId: string,
    orderData: Partial<Omit<Order, "id" | "created_at">>
  ) => {
    const { data, error } = await supabase
      .from("orders")
      .update(orderData)
      .eq("id", orderId)
      // VVVV MUDANÇA AQUI VVVV
      .select("id, client, service, status, imageUri, created_at");

    if (error) {
      console.error("Erro ao atualizar ordem:", error);
      alert("Não foi possível atualizar a ordem.");
    } else if (data) {
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? (data[0] as Order) : order
        )
      );
    }
  };

  const deleteOrder = async (orderId: string) => {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);

    if (error) {
      console.error("Erro ao deletar ordem:", error);
      alert("Não foi possível deletar a ordem.");
    } else {
      setOrders((currentOrders) =>
        currentOrders.filter((order) => order.id !== orderId)
      );
    }
  };

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, updateOrder, deleteOrder, isLoading }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}
