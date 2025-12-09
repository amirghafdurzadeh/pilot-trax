"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Contact() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const searchParams = new URLSearchParams();
      searchParams.set("phone", phone);
      searchParams.set("redirect", "/app");
      router.push("/login?" + searchParams.toString());
    },
    [router, phone]
  );

  return (
    <section
      id="contact"
      className="max-w-7xl mx-auto px-6 md:px-8 mt-20 mb-20 grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>می‌خواهید شروع کنید؟</CardTitle>
          <CardDescription>
            همین حالا ثبت‌نام کنید و اولین تست رایگان خود را شروع کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-3" onSubmit={handleSubmit}>
            <Button type="submit">شروع رایگان</Button>
            <div className="w-full" style={{ direction: "ltr" }}>
              <Input
                name="phone"
                type="tel"
                placeholder="09123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تماس با ما</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>ایمیل: support@yourdomain.com</p>
          <p className="mt-1">آدرس: تهران</p>
        </CardContent>
      </Card>
    </section>
  );
}
