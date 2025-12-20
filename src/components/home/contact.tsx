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

type Props = {
  dict: {
    start: {
      title: string;
      description: string;
      cta: string;
      placeholder: string;
    };
    info: {
      title: string;
      email: string;
      address: string;
    };
  };
};

export function Contact({ dict }: Props) {
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
          <CardTitle>{dict.start.title}</CardTitle>
          <CardDescription>{dict.start.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-3" onSubmit={handleSubmit}>
            <Button type="submit">{dict.start.cta}</Button>
            <div className="w-full" style={{ direction: "ltr" }}>
              <Input
                name="phone"
                type="tel"
                placeholder={dict.start.placeholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{dict.info.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>{dict.info.email}</p>
          <p className="mt-1">{dict.info.address}</p>
        </CardContent>
      </Card>
    </section>
  );
}