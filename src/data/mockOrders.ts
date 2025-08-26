// Caminho: src/data/mockOrders.ts (VERSÃO FINAL E CORRETA)

export interface Order {
  id: string;
  client: string;
  service: string;
  status: "Pendente" | "Em Andamento" | "Concluído";
  imageUri?: string;
  created_at: string; // A data de criação continua obrigatória
}

// Adicionamos a propriedade 'created_at' em cada objeto para satisfazer a regra da interface
export const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    client: "Ana Carolina Silva",
    service: "Troca de tela iPhone 15 Pro",
    status: "Em Andamento",
    created_at: "2025-08-24T12:00:00.000Z",
  },
  {
    id: "2",
    client: "Bruno Costa Lima",
    service: "Reparo placa-mãe notebook Dell G15",
    status: "Pendente",
    created_at: "2025-08-23T14:30:00.000Z",
  },
  {
    id: "3",
    client: "Carlos de Andrade",
    service: "Backup de dados e formatação",
    status: "Concluído",
    created_at: "2025-08-22T10:00:00.000Z",
  },
  {
    id: "4",
    client: "Daniela Martins",
    service: "Limpeza interna de PS5",
    status: "Em Andamento",
    created_at: "2025-08-21T11:20:00.000Z",
  },
  {
    id: "5",
    client: "Eduardo Ferreira",
    service: "Instalação de SSD NVMe",
    status: "Concluído",
    created_at: "2025-08-20T15:30:00.000Z",
  },
  {
    id: "6",
    client: "Fernanda Oliveira",
    service: "Problema na bateria Samsung S23",
    status: "Pendente",
    created_at: "2025-08-19T09:00:00.000Z",
  },
];
