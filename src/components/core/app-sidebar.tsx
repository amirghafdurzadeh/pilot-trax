"use client";
import {
  BookOpenIcon,
  FileSpreadsheet,
  HelpCircleIcon,
  HomeIcon,
  ClipboardCheck,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

import { AppBrand } from "@/components/core/app-brand";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/generated/prisma/client";
import { getDictionary } from "@/lib/dictionaries";
import { AppNavUser } from "./app-nav-user";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";

type Dict = Awaited<ReturnType<typeof getDictionary>>;

const getSidebarItems = (lang: string, dict: Dict["app"]["sidebar"]) => [
  {
    title: dict.dashboard,
    href: `/${lang}/app`,
    icon: HomeIcon,
  },
  {
    title: dict.courses,
    href: `/${lang}/app/courses`,
    icon: BookOpenIcon,
  },
  {
    title: dict.questions,
    href: `/${lang}/app/questions`,
    icon: HelpCircleIcon,
  },
  {
    title: dict.excel,
    href: `/${lang}/app/excel`,
    icon: FileSpreadsheet,
  },
  {
    title: dict.quizzes,
    href: `/${lang}/app/quizzes`,
    icon: ClipboardCheck,
  },
];

export function AppSidebar({
  lang,
  dict,
  session,
}: {
  lang: string;
  dict: Dict;
  session: User;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, setOpen, setOpenMobile } = useSidebar();
  const sidebarItems = getSidebarItems(lang, dict.app.sidebar);

  const handleClick = useCallback(
    (href: string) => {
      if (isMobile) setOpenMobile(false);
      router.push(href);
    },
    [isMobile, router, setOpen, setOpenMobile],
  );

  return (
    <Sidebar side={lang === "fa" ? "right" : "left"}>
      <SidebarHeader className="border-b border-sidebar-border">
        <AppBrand
          lang={lang}
          title={dict.app.sidebar.brand.title}
          className="py-1 px-2"
          imageProps={{
            alt: dict.app.sidebar.brand.alt,
            src: "/logo.svg",
            width: 24,
            height: 24,
            className: "w-10 h-10",
          }}
          titleProps={{
            className: "text-xl font-extralight",
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      onClick={() => handleClick(item.href)}
                      className="cursor-pointer"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-end">
          <LanguageSwitcher lang={lang} />
          <ThemeSwitcher dict={dict.app.theme_switcher} />
        </div>
        <AppNavUser session={session} dict={dict.app.userNav} />
      </SidebarFooter>
    </Sidebar>
  );
}
