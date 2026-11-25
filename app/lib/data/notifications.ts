import { cache } from "react";
import {
  AmbulanceType,
  CriticalSuppliesType,
  OrderType,
  PendingOrdersType,
  SupplyAmbulanceType,
} from "@/app/lib/definitions";
import { fetchSuppliesByAmbulanceId } from "@/app/lib/data/supplies";
import { fetchAmbulancesByDelegationId } from "@/app/lib/data/ambulances";
import { fetchOrders } from "@/app/lib/data/orders";
import { formatDateToDDMMYYYY } from "../utils";

const getNotificationsCoreData = cache(async (delegationId: string) => {
  const [ambulances, orders] = await Promise.all([
    fetchAmbulancesByDelegationId(delegationId).then((result) => result.data),
    fetchOrders().then((result) => result.data),
  ]);

  return { ambulances, orders };
});

export const getNotificationsData = cache(
  async (
    delegationId: string,
  ): Promise<{
    criticalSupplies: CriticalSuppliesType[];
    criticalUnitCount: number;
    pendingOrders: PendingOrdersType[];
    pendingUnitCount: number;
  }> => {
    const { ambulances, orders } = await getNotificationsCoreData(delegationId);

    const ambulanceSupplies = await Promise.all(
      ambulances.map(async (ambulance) => {
        const { data: supplies } = await fetchSuppliesByAmbulanceId(
          ambulance.id,
        );
        return { ambulance, supplies };
      }),
    );

    const { criticalSupplies, criticalUnitCount } =
      getCriticalSupplies(ambulanceSupplies);

    const { pendingOrders, pendingUnitCount } = getPendingOrders(
      delegationId,
      orders,
    );

    return {
      criticalSupplies,
      criticalUnitCount,
      pendingOrders,
      pendingUnitCount,
    };
  },
);

function getCriticalSupplies(
  ambulanceSupplies: {
    ambulance: AmbulanceType;
    supplies: SupplyAmbulanceType[];
  }[],
) {
  const criticalSupplies = ambulanceSupplies.flatMap<CriticalSuppliesType>(
    ({ ambulance, supplies }) =>
      supplies
        .filter((supply) => supply.avaible_quantity <= supply.min_quantity)
        .map((supply) => ({
          supplyId: supply.id,
          ambulanceId: ambulance.id,
          ambulanceNumber: ambulance.number,
          pharmacyId: ambulance.delegation?.pharmacy?.id || "",
          name: `${supply.category} - ${supply.specification}`,
          deficit: supply.min_quantity - supply.avaible_quantity,
        })),
  );

  const criticalUnitCount = new Set(
    criticalSupplies.map((critical) => critical.ambulanceId),
  ).size;

  return {
    criticalSupplies,
    criticalUnitCount,
  };
}

function getPendingOrders(delegationId: string, orders: OrderType[]) {
  const pendingOrders = orders
    .filter(
      (order) =>
        order.status === "pending" && order.delegation.id === delegationId,
    )
    .map(({ id, ambulance, notes, createdAt }) => ({
      orderId: id,
      orderDate: formatDateToDDMMYYYY(createdAt),
      ambulanceNumber: ambulance.number,
      notes: notes || "",
    }));

  const pendingUnitCount = new Set(
    pendingOrders.map((pending) => pending.ambulanceNumber),
  ).size;

  return {
    pendingOrders,
    pendingUnitCount,
  };
}
