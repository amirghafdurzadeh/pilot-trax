"use client";
import { BookOpenIcon, HelpCircleIcon, HomeIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

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

const getSidebarItems = (lang: string) => [
  {
    title: "داشبورد",
    href: `/${lang}/app`,
    icon: HomeIcon,
  },
  {
    title: "دوره‌ها",
    href: `/${lang}/app/courses`,
    icon: BookOpenIcon,
  },
  {
    title: "سوالات",
    href: `/${lang}/app/questions`,
    icon: HelpCircleIcon,
  },
];

export function AppSidebar({ lang }: { lang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, setOpen, setOpenMobile } = useSidebar();
  const sidebarItems = getSidebarItems(lang);

  const handleClick = useCallback(
    (href: string) => {
      if (isMobile) setOpenMobile(false);
      router.push(href);
    },
    [isMobile, router, setOpen, setOpenMobile]
  );

  return (
    <Sidebar side="right">
      <SidebarHeader className="border-b border-sidebar-border">
        <AppBrand
          title="پایلت ترکس"
          className="py-1 px-2"
          imageProps={{
            alt: "Pilot Trax - پایلت ترکس",
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
