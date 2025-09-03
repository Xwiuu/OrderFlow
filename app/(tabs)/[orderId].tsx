// Caminho: app/(tabs)/[orderId].tsx

// VVVV CORREÇÃO PRINCIPAL AQUI VVVV
// O caminho correto a partir de app/(tabs)/ para chegar a src/screens/
import OrderDetailsScreen from "../../src/screens/OrderDetailsScreen";

export default function OrderDetailsRoute() {
  return <OrderDetailsScreen />;
}
