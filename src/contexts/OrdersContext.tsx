// Caminho: src/contexts/OrdersContext.tsx (VERSÃO 100% ATUALIZADA)

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Order } from "../data/mockOrders";
import { supabase } from "../lib/supabase";
import { Profile, Task } from "../types/database";
import { useAuth } from "./AuthContext";

interface OrderData {
  client: string;
  service: string;
  imageUri?: string;
}

// VVVV INTERFACE FINALIZADA VVVV
interface OrdersContextData {
  orders: Order[];
  addOrder: (data: OrderData) => Promise<void>;
  updateOrder: (
    orderId: string,
    data: Partial<Omit<Order, "id" | "created_at">>
  ) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  isLoading: boolean;
  tasks: Task[];
  fetchTasks: (orderId: string) => Promise<void>;
  addTask: (orderId: string, description: string) => Promise<void>;
  toggleTaskStatus: (taskId: number, currentStatus: boolean) => Promise<void>;
  collaborators: Profile[];
  fetchCollaborators: (orderId: string) => Promise<void>;
  allUsers: Profile[];
  fetchAllUsers: () => Promise<void>;
  addCollaborator: (orderId: string, userId: string) => Promise<void>;
  removeCollaborator: (orderId: string, userId: string) => Promise<void>; // Adicionado
}
// ▲▲▲ FIM DA ATUALIZAÇÃO ▲▲▲

const OrdersContext = createContext<OrdersContextData>({} as OrdersContextData);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [collaborators, setCollaborators] = useState<Profile[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const { session } = useAuth();

  useEffect(() => {
    async function loadOrdersFromDB() {
      if (!session) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("id, client, service, status, imageUri, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar as ordens:", error);
      } else {
        setOrders(data as Order[]);
      }
      setIsLoading(false);
    }
    loadOrdersFromDB();
  }, [session]);

  const fetchTasks = async (orderId: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao buscar tarefas:", error);
      setTasks([]);
    } else {
      setTasks(data || []);
    }
  };

  const addTask = async (orderId: string, description: string) => {
    if (!description) return;
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ order_id: orderId, description: description }])
      .select()
      .single();
    if (error) {
      console.error("Erro ao adicionar tarefa:", error);
      alert("Não foi possível adicionar a tarefa.");
    } else if (data) {
      setTasks((currentTasks) => [...currentTasks, data]);
    }
  };

  const toggleTaskStatus = async (taskId: number, currentStatus: boolean) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, is_completed: !currentStatus } : task
      )
    );
    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: !currentStatus })
      .eq("id", taskId);
    if (error) {
      console.error("Erro ao atualizar status da tarefa:", error);
      alert("Não foi possível sincronizar a tarefa.");
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, is_completed: currentStatus } : task
        )
      );
    }
  };

  const fetchCollaborators = async (orderId: string) => {
    const { data, error } = await supabase
      .from("order_collaborators")
      .select("profiles!inner(*)")
      .eq("order_id", orderId);

    if (error) {
      console.error("Erro ao buscar colaboradores:", error);
      setCollaborators([]);
    } else if (data) {
      const collaboratorProfiles = data.map((item) => item.profiles);
      setCollaborators(collaboratorProfiles as any as Profile[]);
    }
  };

  const fetchAllUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("*");

    if (error) {
      console.error("Erro ao ir buscar todos os utilizadores:", error);
    } else {
      setAllUsers(data as Profile[]);
    }
  };

  const addCollaborator = async (orderId: string, userId: string) => {
    const isAlreadyCollaborator = collaborators.some((c) => c.id === userId);
    if (isAlreadyCollaborator) {
      alert("Este utilizador já é um colaborador.");
      return;
    }

    const { error } = await supabase
      .from("order_collaborators")
      .insert([{ order_id: orderId, user_id: userId }]);

    if (error) {
      console.error("Erro ao adicionar colaborador:", error);
      alert("Não foi possível adicionar o colaborador.");
    } else {
      await fetchCollaborators(orderId);
    }
  };

  const removeCollaborator = async (orderId: string, userId: string) => {
    const { error } = await supabase
      .from("order_collaborators")
      .delete()
      .eq("order_id", orderId)
      .eq("user_id", userId);

    if (error) {
      console.error("Erro ao remover colaborador:", error);
      alert("Não foi possível remover o colaborador.");
    } else {
      setCollaborators((current) => current.filter((c) => c.id !== userId));
    }
  };

  const addOrder = async (orderData: OrderData) => {
    const newOrderPayload = {
      ...orderData,
      status: "Pendente",
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("orders")
      .insert([newOrderPayload])
      .select("id, client, service, status, imageUri, created_at");
    if (error) {
      console.error("Erro ao adicionar ordem:", error.message);
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
      .select("id, client, service, status, imageUri, created_at");
    if (error) {
      console.error("Erro ao atualizar ordem:", error);
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
    } else {
      setOrders((currentOrders) =>
        currentOrders.filter((order) => order.id !== orderId)
      );
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        isLoading,
        tasks,
        fetchTasks,
        addTask,
        toggleTaskStatus,
        collaborators,
        fetchCollaborators,
        allUsers,
        fetchAllUsers,
        addCollaborator,
        removeCollaborator,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}
