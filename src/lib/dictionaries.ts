import "server-only";
import { Locale } from "./locales";

type Dictionary = typeof import("@/../dictionaries/en.json");

const dictionaries: { [key in Locale]: () => Promise<Dictionary> } = {
  en: () =>
    import("@/../dictionaries/en.json").then((module) => module.default),
  fa: () =>
    import("@/../dictionaries/fa.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
