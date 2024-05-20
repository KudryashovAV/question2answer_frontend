"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setCookie, getCookie } from "cookies-next";
import envConfig from "@/config";

export function LangSwitcher() {
  const [lang, setLang] = useState("EN");
  const router = useRouter();

  useEffect(() => {
    if (window && window != undefined) {
      const currentPath = window.location.href;

      currentPath.includes("ru.") ? setCookie("lang", "RU") : setCookie("lang", "EN");

      const lang = getCookie("lang")?.toUpperCase() || "EN";
      setLang(lang);
    }
  }, []);

  const redirectToSubdomain = (e: { target: { value: string } }) => {
    let subdomainUrl = envConfig.NEXT_PUBLIC_MAIN_DOMAIN_URL as string;

    if (e.target.value == "RU") {
      subdomainUrl = envConfig.NEXT_PUBLIC_RU_DOMAIN_URL as string;
      setLang("RU");
    } else {
      setLang("EN");
    }
    const currentUrl = window.location.href;

    const pageUrl = currentUrl.replace(envConfig.NEXT_PUBLIC_MAIN_DOMAIN_URL as string, "");
    const finalPageUrl = pageUrl.replace(envConfig.NEXT_PUBLIC_RU_DOMAIN_URL as string, "");

    router.push(subdomainUrl + finalPageUrl);
  };

  return (
    <form className="mx-auto max-w-sm">
      <select
        id="countries"
        value={lang}
        onChange={redirectToSubdomain}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        <option value="EN">EN 🇬🇧</option>
        <option value="RU">RU 🇷🇺</option>
      </select>
    </form>
  );
}
