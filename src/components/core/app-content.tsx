type Props = Readonly<{ children?: React.ReactNode }>;

export function AppContent(props: Props) {
  return <div className="flex flex-1 flex-col gap-4 p-4">{props.children}</div>;
}
