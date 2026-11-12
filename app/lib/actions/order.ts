"use server";

import { OrderState } from "@/app/lib/config/stateConfigs";
import {
  AttendedOrderAction,
  UpdateOrderAction,
} from "@/app/lib/actions/services/order";
import { OrderDetailType } from "@/app/lib/definitions";

export async function updateOrder(
  id: string,
  formData: FormData,
  prevState: OrderState,
): Promise<OrderState> {
  const action = new UpdateOrderAction(id);
  return action.execute(prevState, formData);
}

export async function attendOrder(
  id: string,
  ambulanceId: string,
  orders: OrderDetailType[],
): Promise<OrderState> {
  const action = new AttendedOrderAction(id, ambulanceId, orders);
  return action.execute();
}
