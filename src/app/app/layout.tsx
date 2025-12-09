import { authentication } from "@/actions/auth";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function Layout(props: Props) {
  await authentication();
  return <main className="w-full p-4">{props.children}</main>;
}
