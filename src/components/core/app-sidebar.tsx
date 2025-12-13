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

const sidebarItems = [
  {
    title: "داشبورد",
    href: "/app",
    icon: HomeIcon,
  },
  {
    title: "دوره‌ها",
    href: "/app/courses",
    icon: BookOpenIcon,
  },
  {
    title: "سوالات",
    href: "/app/questions",
    icon: HelpCircleIcon,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, setOpen, setOpenMobile } = useSidebar();

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
