"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { useLogin } from "@/context/login";

export function Contact() {
  const router = useRouter();
  const { phone, setPhone } = useLogin();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      router.push("/login");
    },
    [router, phone]
  );

  return (
    <section
      id="contact"
      className="max-w-7xl mx-auto px-6 md:px-8 mt-20 mb-20 grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow">
        <h4 className="font-bold text-xl">می‌خواهید شروع کنید؟</h4>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          همین حالا ثبت‌نام کنید و اولین تست رایگان خود را شروع کنید.
        </p>
        <form className="mt-4 flex gap-3" onSubmit={handleSubmit}>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md whitespace-nowrap cursor-pointer"
          >
            شروع رایگان
          </button>
          <input
            name="phone"
            type="tel"
            placeholder="09123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </form>
      </div>

      <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow">
        <h4 className="font-bold text-xl">تماس با ما</h4>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          ایمیل: support@yourdomain.com
        </p>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          آدرس: تهران
        </p>
      </div>
    </section>
  );
}
