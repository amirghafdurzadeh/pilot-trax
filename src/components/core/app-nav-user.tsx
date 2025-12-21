import {
  CircleUserRoundIcon,
  CreditCardIcon,
  EllipsisIcon,
  LogOutIcon,
  UserCircleIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useTransition } from "react";

import { logout } from "@/actions/auth/logout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/generated/prisma/client";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";

type Dict = Awaited<ReturnType<typeof getDictionary>>;

function AppAvatar({
  user,
  dict,
}: {
  user: User;
  dict: Dict["app"]["userNav"];
}) {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg grayscale">
        {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
        <AvatarFallback className="rounded-lg">
          <CircleUserRoundIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-start text-sm leading-tight">
        <span className="truncate font-medium">
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : dict.unnamedUser}
        </span>
        <span className="text-muted-foreground truncate text-xs">
          {user.phone}
        </span>
      </div>
    </>
  );
}

export function AppNavUser({
  session: user,
  dict,
}: {
  session: User;
  dict: Dict["app"]["userNav"];
}) {
  const { isMobile } = useSidebar();
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const lang = params.lang as Locale;

  const onLogout = () => {
    startTransition(async () => {
      await logout(lang);
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <AppAvatar user={user} dict={dict} />
              <EllipsisIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                <AppAvatar user={user} dict={dict} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircleIcon />
                {dict.account}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                {dict.billing}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} disabled={isPending}>
              <LogOutIcon />
              {dict.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
