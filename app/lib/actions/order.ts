"use server";

import { OrderState } from "@/app/lib/config/stateConfigs";
import {
  AttendedOrderAction,
  DeleteOrderAction,
  UpdateOrderAction,
} from "@/app/lib/actions/services/order";

export async function deleteOrder(id: string): Promise<OrderState> {
  const action = new DeleteOrderAction(id);
  return action.execute();
}

export async function updateOrder(
  id: string,
  formData: FormData,
  prevState: OrderState,
): Promise<OrderState> {
  const action = new UpdateOrderAction(id);
  return action.execute(prevState, formData);
}

export async function attendOrder(id: string): Promise<OrderState> {
  const action = new AttendedOrderAction(id);
  return action.execute();
}
