import { OrderType, PaginatedResult } from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/core/base-data";

export async function fetchOrders(
  params?: Record<string, string | number | boolean>,
): Promise<PaginatedResult<OrderType>> {
  try {
    const dataFetching = new DataFetch<OrderType>("/api/supply-reports", true);
    return await dataFetching.getAll(params);
  } catch (error) {
    console.log("API Error[GET ORDERS]:", error);
    return { data: [], totalRecords: 0 };
  }
}

export async function fetchOrderById(
  id: string,
): Promise<OrderType | undefined> {
  try {
    const dataFetching = new DataFetch<OrderType>("/api/supply-reports", true);
    // return await dataFetching.getOne();
    // TODO: Pedir implementación del endpoint para obtener orden por ID

    const response = await dataFetching.getAll();
    const order = response.data.find((order) => order.id === id);
    return order;
  } catch (error) {
    console.log("API Error[GET ORDER]:", error);
    return;
  }
}
