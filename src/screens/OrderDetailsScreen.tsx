// Caminho: src/screens/OrderDetailsScreen.tsx

import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { MotiPressable } from "moti/interactions";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
// VVVV CAMINHOS CORRIGIDOS PARA ESTE FICHEIRO VVVV
import { useOrders } from "../contexts/OrdersContext";
import { Order, Profile, Task } from "../types/database";

// Tipos e cores para os status
const statusOptions: Order["status"][] = [
  "Pendente",
  "Em Andamento",
  "Concluído",
];
const statusColors = {
  Pendente: "#FFD700",
  "Em Andamento": "#00BFFF",
  Concluído: "#32CD32",
};

// Componente para renderizar cada tarefa
const TaskListItem = ({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: () => void;
}) => (
  <TouchableOpacity onPress={onToggle} style={styles.taskContainer}>
    <MotiView
      from={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring" }}
      key={task.is_completed ? "completed" : "pending"}
    >
      <MaterialCommunityIcons
        name={
          task.is_completed
            ? "checkbox-marked-circle"
            : "checkbox-blank-circle-outline"
        }
        size={24}
        color={task.is_completed ? statusColors.Concluído : "#a0a0a0"}
      />
    </MotiView>
    <Text
      style={[styles.taskText, task.is_completed && styles.taskTextCompleted]}
    >
      {task.description}
    </Text>
  </TouchableOpacity>
);

// Componente para renderizar cada colaborador
const CollaboratorListItem = ({
  collaborator,
  onRemove,
}: {
  collaborator: Profile;
  onRemove: () => void;
}) => (
  <View style={styles.collaboratorContainer}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>
        {collaborator.full_name
          ? collaborator.full_name.charAt(0).toUpperCase()
          : "U"}
      </Text>
    </View>
    <Text style={styles.collaboratorName}>
      {collaborator.full_name || "Usuário"}
    </Text>
    <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
      <MaterialCommunityIcons name="close-circle" size={24} color="#FF3B30" />
    </TouchableOpacity>
  </View>
);

export default function OrderDetailsScreen() {
  const { orderId } = useLocalSearchParams();
  const {
    orders,
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
  } = useOrders();
  const router = useRouter();

  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isCollaboratorModalVisible, setCollaboratorModalVisible] =
    useState(false);

  const order = orders.find((o: Order) => o.id === orderId);

  useEffect(() => {
    if (order) {
      fetchTasks(order.id);
      fetchCollaborators(order.id);
    }
  }, [order, fetchTasks, fetchCollaborators]);

  const handleAddTask = () => {
    setNewTaskDescription("");
    setTaskModalVisible(true);
  };

  const handleSaveTask = async () => {
    if (order && newTaskDescription) {
      await addTask(order.id, newTaskDescription);
      setTaskModalVisible(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    await toggleTaskStatus(task.id, task.is_completed);
  };

  const handleOpenCollaboratorModal = () => {
    fetchAllUsers();
    setCollaboratorModalVisible(true);
  };

  const handleAddCollaborator = async (userId: string) => {
    if (order) {
      await addCollaborator(order.id, userId);
    }
  };

  const handleRemoveCollaborator = (userId: string) => {
    if (!order) return;
    Alert.alert(
      "Remover Colaborador",
      "Tem certeza que deseja remover este colaborador da ordem?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => await removeCollaborator(order.id, userId),
        },
      ]
    );
  };

  async function handleStatusChange(newStatus: Order["status"]) {
    if (order) {
      await updateOrder(order.id, { status: newStatus });
    }
  }

  function handleDelete() {
    if (!order) return;
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a ordem de ${order.client}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteOrder(order.id);
            router.back();
          },
        },
      ]
    );
  }

  if (isLoading && !order) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: true, title: "Erro" }} />
        <View style={styles.loadingContainer}>
          <Text style={styles.client}>Ordem não encontrada!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.client}>{order.client}</Text>
        <Text style={styles.service}>{order.service}</Text>

        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Alterar Status</Text>
          <View style={styles.statusButtonsContainer}>
            {statusOptions.map((status) => (
              <MotiPressable
                key={status}
                style={[
                  styles.statusButton,
                  order.status === status && {
                    backgroundColor: statusColors[status],
                    borderColor: statusColors[status],
                  },
                ]}
                onPress={() => handleStatusChange(status)}
                animate={{ scale: order.status === status ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    order.status === status && { color: "#121212" },
                  ]}
                >
                  {status}
                </Text>
              </MotiPressable>
            ))}
          </View>
        </View>

        <View style={styles.checklistSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Checklist de Tarefas</Text>
            <TouchableOpacity onPress={handleAddTask}>
              <MaterialCommunityIcons
                name="plus-circle"
                size={28}
                color="#007AFF"
              />
            </TouchableOpacity>
          </View>
          {tasks.length > 0 ? (
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TaskListItem
                  task={item}
                  onToggle={() => handleToggleTask(item)}
                />
              )}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>
              Nenhuma tarefa adicionada ainda.
            </Text>
          )}
        </View>

        <View style={styles.collaboratorsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Equipa / Colaboradores</Text>
            <TouchableOpacity onPress={handleOpenCollaboratorModal}>
              <MaterialCommunityIcons
                name="plus-circle"
                size={28}
                color="#007AFF"
              />
            </TouchableOpacity>
          </View>
          {collaborators.length > 0 ? (
            <FlatList
              data={collaborators}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CollaboratorListItem
                  collaborator={item}
                  onRemove={() => handleRemoveCollaborator(item.id)}
                />
              )}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>Nenhum colaborador adicionado.</Text>
          )}
        </View>

        {order.imageUri && (
          <View style={styles.imageContainer}>
            <Text style={styles.sectionTitle}>Foto Anexada</Text>
            <Image source={{ uri: order.imageUri }} style={styles.image} />
          </View>
        )}
      </ScrollView>

      <View style={styles.actionsContainer}>
        <Link
          href={{
            pathname: "/(tabs)/new-order",
            params: { orderId: order.id },
          }}
          asChild
        >
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>EDITAR ORDEM</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Excluir Ordem</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isTaskModalVisible}
        onRequestClose={() => setTaskModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Nova Tarefa</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Descrição da tarefa..."
              placeholderTextColor="#555"
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setTaskModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveTask}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCollaboratorModalVisible}
        onRequestClose={() => setCollaboratorModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Colaborador</Text>
            <FlatList
              data={allUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userListItem}
                  onPress={() => handleAddCollaborator(item.id)}
                >
                  <Text style={styles.collaboratorName}>{item.full_name}</Text>
                </TouchableOpacity>
              )}
            />
            <Pressable
              style={[
                styles.modalButton,
                styles.modalButtonCancel,
                { alignSelf: "flex-end", marginTop: 10 },
              ]}
              onPress={() => setCollaboratorModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#121212" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  scrollContainer: { padding: 16, paddingBottom: 24 },
  client: { color: "#FFFFFF", fontSize: 32, fontWeight: "bold" },
  service: { color: "#a0a0a0", fontSize: 18, marginTop: 8 },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusSection: { marginTop: 32 },
  statusButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    marginTop: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3e3e3e",
    alignItems: "center",
  },
  statusButtonText: { color: "#a0a0a0", fontWeight: "bold" },
  imageContainer: { marginTop: 32 },
  image: { width: "100%", height: 50, borderRadius: 8, marginTop: 12 },
  actionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#1e1e1e",
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  editButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  deleteButton: { paddingVertical: 18, alignItems: "center" },
  deleteButtonText: { color: "#FF3B30", fontSize: 16, fontWeight: "500" },
  checklistSection: {
    marginTop: 32,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  taskText: {
    fontSize: 16,
    color: "#E0E0E0",
    marginLeft: 12,
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#757575",
  },
  emptyText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    paddingVertical: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "70%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: "#1e1e1e",
    color: "white",
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  modalButtonCancel: {
    backgroundColor: "#3e3e3e",
  },
  modalButtonSave: {
    backgroundColor: "#007AFF",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  collaboratorsSection: {
    marginTop: 32,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
  },
  collaboratorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3e3e3e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  collaboratorName: {
    fontSize: 16,
    color: "#E0E0E0",
    flex: 1,
  },
  userListItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3e3e3e",
  },
  removeButton: {
    marginLeft: "auto",
    padding: 8,
  },
});
