"use client";
import { BookOpenIcon, HelpCircleIcon, HomeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AppBrand } from "./app-brand";

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
  const pathname = usePathname();

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
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
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
