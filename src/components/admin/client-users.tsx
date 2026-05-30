"use client";

import { ShieldCheck, ShieldAlert, Sparkles, Award, Search, User, Crown } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateUserRoleAction } from "@/actions/users";
import { AppContent } from "@/components/core/app-content";
import { AppHeader } from "@/components/core/app-header";
import { AppSearch } from "@/components/core/app-search";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";

type AppDict = Awaited<ReturnType<typeof getDictionary>>;

interface UserItem {
  id: string;
  phone: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  roles: string[];
}

export default function UsersPageClient({
  initialUsers,
  lang,
  dict,
  currentRole,
}: {
  initialUsers: UserItem[];
  lang: Locale;
  dict: AppDict;
  currentRole: "system_user" | "admin" | "premium" | null;
}) {
  const isSystemUser = currentRole === "system_user";
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const uDict = dict.app.admin.users || {
    title: lang === "fa" ? "مدیریت کاربران" : "User Management",
    search_placeholder: lang === "fa" ? "جستجو بر اساس نام یا شماره تلفن..." : "Search by name or phone...",
    phone: lang === "fa" ? "تلفن" : "Phone",
    name: lang === "fa" ? "نام" : "Name",
    roles: lang === "fa" ? "نقش‌ها" : "Roles",
    actions: lang === "fa" ? "عملیات" : "Actions",
    admin: lang === "fa" ? "مدیر" : "Admin",
    premium: lang === "fa" ? "ویژه" : "Premium",
    basic: lang === "fa" ? "عادی" : "Basic",
    make_admin: lang === "fa" ? "ارتقا به مدیر" : "Make Admin",
    revoke_admin: lang === "fa" ? "لغو مدیریت" : "Revoke Admin",
    make_premium: lang === "fa" ? "ارتقا به ویژه" : "Make Premium",
    revoke_premium: lang === "fa" ? "لغو ویژه" : "Revoke Premium",
    system_user: lang === "fa" ? "مدیر سیستم" : "System User",
    role_updated: lang === "fa" ? "نقش کاربر با موفقیت بروزرسانی شد" : "User role updated successfully",
    failed_to_update: lang === "fa" ? "بروزرسانی نقش کاربر ناموفق بود" : "Failed to update user role",
    cannot_revoke_self: lang === "fa" ? "شما نمی‌توانید نقش مدیریت خود را لغو کنید" : "You cannot revoke your own admin role",
    only_system_user: lang === "fa" ? "فقط مدیر سیستم می‌تواند نقش مدیر را مدیریت کند" : "Only system user can manage admin roles",
  };

  const filteredUsers = users.filter(
    (u) =>
      u.phone.includes(searchQuery) ||
      (u.firstName && u.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.lastName && u.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggleRole = async (userId: string, roleId: "admin" | "premium", currentHasRole: boolean) => {
    const action = currentHasRole ? "remove" : "add";

    // Optimistic state update
    const previousUsers = [...users];
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newRoles = action === "add"
            ? [...u.roles, roleId]
            : u.roles.filter((r) => r !== roleId);
          return { ...u, roles: newRoles };
        }
        return u;
      })
    );

    startTransition(async () => {
      try {
        const res = await updateUserRoleAction(userId, roleId, action, lang);
        if (res.success) {
          toast.success(uDict.role_updated);
        }
      } catch (error: any) {
        // Rollback on error
        setUsers(previousUsers);
        toast.error(error.message || uDict.failed_to_update);
      }
    });
  };

  return (
    <>
      <AppHeader lang={lang} dict={dict.app}>
        <div className="flex items-center gap-2 flex-1">
          <AppSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={uDict.search_placeholder}
          />
        </div>
      </AppHeader>

      <AppContent>
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{uDict.title}</h1>
              <p className="text-sm text-muted-foreground">
                {lang === "fa" ? "مدیریت نقش‌ها و دسترسی‌های کاربران سیستم" : "Manage user roles and permissions in the system"}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-left rtl:text-right text-muted-foreground">
                <thead className="bg-muted/50 font-medium text-foreground border-b border-border">
                  <tr>
                    <th className="p-4 align-middle">{uDict.phone}</th>
                    <th className="p-4 align-middle">{uDict.name}</th>
                    <th className="p-4 align-middle">{uDict.roles}</th>
                    <th className="p-4 align-middle text-right rtl:text-left">{uDict.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">
                        {lang === "fa" ? "هیچ کاربری یافت نشد" : "No users found"}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isSystemUserRole = user.roles.includes("system_user");
                      const isAdminUser = user.roles.includes("admin");
                      const isPremiumUser = user.roles.includes("premium");
                      const isBasicUser = !isAdminUser && !isPremiumUser && !isSystemUserRole;

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-4 align-middle font-mono font-medium text-foreground">
                            {user.phone}
                          </td>
                          <td className="p-4 align-middle text-foreground">
                            {user.firstName || user.lastName ? (
                              <span className="font-semibold">
                                {user.firstName || ""} {user.lastName || ""}
                              </span>
                            ) : (
                              <span className="text-muted-foreground italic flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" />
                                {lang === "fa" ? "بدون نام" : "Unnamed User"}
                              </span>
                            )}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-wrap gap-1.5">
                              {isSystemUserRole && (
                                <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-medium flex items-center gap-1">
                                  <Crown className="w-3 h-3" />
                                  {uDict.system_user}
                                </Badge>
                              )}
                              {isAdminUser && (
                                <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 font-medium flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  {uDict.admin}
                                </Badge>
                              )}
                              {isPremiumUser && (
                                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  {uDict.premium}
                                </Badge>
                              )}
                              {isBasicUser && (
                                <Badge variant="secondary" className="font-normal">
                                  {uDict.basic}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4 align-middle text-right rtl:text-left">
                            <div className="flex justify-end gap-2">
                              {isSystemUser && !isSystemUserRole && (
                                <Button
                                  size="sm"
                                  variant={isAdminUser ? "destructive" : "outline"}
                                  className="gap-1.5 transition-all text-xs h-8 cursor-pointer"
                                  onClick={() => handleToggleRole(user.id, "admin", isAdminUser)}
                                  disabled={isPending}
                                >
                                  {isAdminUser ? (
                                    <>
                                      <ShieldAlert className="w-3.5 h-3.5" />
                                      {uDict.revoke_admin}
                                    </>
                                  ) : (
                                    <>
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                      {uDict.make_admin}
                                    </>
                                  )}
                                </Button>
                              )}

                              {!isSystemUserRole && (
                                <Button
                                  size="sm"
                                  variant={isPremiumUser ? "destructive" : "outline"}
                                  className="gap-1.5 transition-all text-xs h-8 border-amber-500/30 hover:bg-amber-500/5 hover:text-amber-600 cursor-pointer"
                                  onClick={() => handleToggleRole(user.id, "premium", isPremiumUser)}
                                  disabled={isPending}
                                >
                                  {isPremiumUser ? (
                                    <>
                                      <Award className="w-3.5 h-3.5" />
                                      {uDict.revoke_premium}
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5" />
                                      {uDict.make_premium}
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AppContent>
    </>
  );
}
