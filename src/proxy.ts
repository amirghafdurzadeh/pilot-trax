import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "fa"];
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;
  const languages = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim());

  for (const lang of languages) {
    if (locales.includes(lang)) {
      return lang;
    }
  }

  for (const lang of languages) {
    const baseLang = lang.split("-")[0];
    const match = locales.find(
      (locale) => locale === baseLang || locale.startsWith(baseLang + "-")
    );
    if (match) return match;
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)",
    // "/((?!_next|.*\\..*).*)",
  ],
};
