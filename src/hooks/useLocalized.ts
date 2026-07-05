import { useTranslation } from "react-i18next";

type LangSuffix = "Uz" | "Ru" | "En";

function suffixFor(lang: string): LangSuffix {
  if (lang.startsWith("ru")) return "Ru";
  if (lang.startsWith("en")) return "En";
  return "Uz";
}

/**
 * Given an object with fields like nameUz/nameRu/nameEn and a base key "name",
 * returns the value matching the currently active language.
 */
export function useLocalized() {
  const { i18n } = useTranslation();
  const suffix = suffixFor(i18n.language);

  return function pick<T extends Record<string, any>>(obj: T, baseKey: string): string {
    return obj[`${baseKey}${suffix}`] ?? obj[`${baseKey}Uz`] ?? "";
  };
}
