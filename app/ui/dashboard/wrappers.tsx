import { getNotificationsData } from "@/app/lib/data/notifications";
import { CriticalSuppliesType, PendingOrdersType } from "@/app/lib/definitions";

export async function WrapperTable<T>({
  fetchData,
  WrappedComponent,
  onClose,
  readonly,
  route,
  userRole,
}: {
  fetchData: () => Promise<T>;
  WrappedComponent: React.ComponentType<{
    data: T;
    onClose?: () => void;
    readonly?: boolean;
    route?: string;
    userRole?: string;
  }>;
  onClose?: () => void;
  readonly?: boolean;
  route?: string;
  userRole?: string;
}) {
  //(Component) Wrapper Tabla fetch data - [SSR]

  const data = await fetchData();

  return (
    <WrappedComponent
      data={data}
      onClose={onClose}
      readonly={readonly}
      route={route}
      userRole={userRole || ""}
    />
  );
}

export async function WrapperForm<T>({
  fetchData,
  WrappedComponent,
}: {
  fetchData: () => Promise<T>;
  WrappedComponent: React.ComponentType<{ data: T }>;
}) {
  //(Component) Wrapper Form fetch data - [SSR]

  const data = await fetchData();

  return <WrappedComponent data={data} />;
}

export async function WrapperNotifications({
  delegationId,
  buttonClassName,
  isAdmin,
  WrappedComponent,
}: {
  delegationId: string;
  buttonClassName: string;
  isAdmin?: boolean;
  WrappedComponent: React.ComponentType<{
    buttonClassName: string;
    count: number;
    criticalSupplies: CriticalSuppliesType[];
    criticalUnitCount: number;
    pendingOrders: PendingOrdersType[];
    pendingUnitCount: number;
  }>;
}) {
  //(Component) Wrapper Form fetch notifications data - [SSR]

  const {
    criticalSupplies,
    criticalUnitCount,
    pendingOrders,
    pendingUnitCount,
  } = isAdmin
    ? await getNotificationsData(delegationId)
    : {
        criticalSupplies: [],
        criticalUnitCount: 0,
        pendingOrders: [],
        pendingUnitCount: 0,
      };

  // Calcular el recuento total de notificaciones
  const count = criticalSupplies.length + pendingOrders.length;

  return (
    <WrappedComponent
      buttonClassName={buttonClassName}
      count={count}
      criticalSupplies={criticalSupplies}
      criticalUnitCount={criticalUnitCount}
      pendingOrders={pendingOrders}
      pendingUnitCount={pendingUnitCount}
    />
  );
}
