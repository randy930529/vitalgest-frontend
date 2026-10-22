"use server";

import { OrderState } from "@/app/lib/config/stateConfigs";
import { DeleteOrderAction } from "@/app/lib/actions/services/order";

export async function deleteOrder(id: string): Promise<OrderState> {
  const action = new DeleteOrderAction(id);
  return action.execute();
}
