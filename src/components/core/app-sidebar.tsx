"use client";
import { BookOpenIcon, HelpCircleIcon, HomeIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

import { AppBrand } from "@/components/core/app-brand";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getDictionary } from "@/lib/dictionaries";

type Dict = Awaited<ReturnType<typeof getDictionary>>["app"]["sidebar"];

const getSidebarItems = (lang: string, dict: Dict) => [
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
];

export function AppSidebar({ lang, dict }: { lang: string; dict: Dict }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, setOpen, setOpenMobile } = useSidebar();
  const sidebarItems = getSidebarItems(lang, dict);

  const handleClick = useCallback(
    (href: string) => {
      if (isMobile) setOpenMobile(false);
      router.push(href);
    },
    [isMobile, router, setOpen, setOpenMobile]
  );

  return (
    <Sidebar side={lang === "fa" ? "right" : "left"}>
      <SidebarHeader className="border-b border-sidebar-border">
        <AppBrand
          title={dict.brand.title}
          className="py-1 px-2"
          imageProps={{
            alt: dict.brand.alt,
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
    </Sidebar>
  );
}
