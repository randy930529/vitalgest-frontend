export async function WrapperTable<T>({
  fetchData,
  WrappedComponent,
  onClose,
  readonly,
  route,
}: {
  fetchData: () => Promise<T>;
  WrappedComponent: React.ComponentType<{
    data: T;
    onClose?: () => void;
    readonly?: boolean;
    route?: string;
  }>;
  onClose?: () => void;
  readonly?: boolean;
  route?: string;
}) {
  //(Component) Wrapper Tabla fetch data - [SSR]

  const data = await fetchData();

  return (
    <WrappedComponent
      data={data}
      onClose={onClose}
      readonly={readonly}
      route={route}
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
