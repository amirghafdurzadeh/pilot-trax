import { needAuthAction } from "@/actions/auth/need-auth";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function Layout(props: Props) {
  await needAuthAction();
  return <main className="w-full p-4">{props.children}</main>;
}
