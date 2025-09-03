// Caminho: src/types/database.ts

import { Order as OriginalOrder } from "../data/mockOrders";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  // Adicione esta linha para garantir compatibilidade
  [key: string]: any;
}

export interface Task {
  id: number;
  order_id: string;
  description: string;
  is_completed: boolean;
  created_at: string;
}

export interface Order extends OriginalOrder {
  tasks?: Task[];
  collaborators?: Profile[];
}