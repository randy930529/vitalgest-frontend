export async function WrapperTable<T>({
  fetchData,
  WrappedComponent,
  onClose,
}: {
  fetchData: () => Promise<T>;
  WrappedComponent: React.ComponentType<{ data: T; onClose?: () => void }>;
  onClose?: () => void;
}) {
  //(Component) Wrapper Tabla fetch data - [SSR]

  const data = await fetchData();

  return <WrappedComponent data={data} onClose={onClose} />;
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
