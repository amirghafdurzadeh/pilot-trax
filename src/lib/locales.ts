export const locales = ["en", "fa"];

export type Locale = (typeof locales)[number];

export const hasLocale = (locale: string): locale is Locale => {
  return locales.includes(locale);
};
