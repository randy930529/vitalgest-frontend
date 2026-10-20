import { OrderType, PaginatedResult } from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/core/base-data";

export async function fetchOrders(
  params?: Record<string, string | number | boolean>,
): Promise<PaginatedResult<OrderType>> {
  try {
    const dataFetching = new DataFetch<OrderType>("/api/orders", true);
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
    const dataFetching = new DataFetch<OrderType>(
      `/api/orders/one/${id}`,
      true,
    );
    return await dataFetching.getOne();
  } catch (error) {
    console.log("API Error[GET ORDER]:", error);
    return;
  }
}
