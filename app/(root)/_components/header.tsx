"use client";

import { ThemeToggle } from "./theme-toggle";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";
import { LangSwitcher } from "./lang-switcher";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { buttonVariants } from "@/components/ui/button";
import UserMenu from "@/components/user-menu";
import { cn } from "@/lib/utils";
import { i18n } from "@/app/(root)/i118n";
import Login from "@/components/login";

interface Props {
  currentUser: any;
}

export default function Header({ currentUser }: Props) {
  const [lang, setLang] = useState("en");
  const [open, setOpen] = useState(false);

  let login = i18n()[lang]["login"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    login = i18n()[lang]["login"];
  }, []);

  return (
    <header className="flex-between background-light900_dark200 sticky top-0 z-50 h-20 w-full gap-5 px-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Logo />
      <div className="flex-between gap-5">
        {currentUser ? (
          <UserMenu user={currentUser} />
        ) : (
          <div
            className={cn(buttonVariants(), "primary-gradient text-white")}
            onClick={() => setOpen(true)}
          >
            {login}
          </div>
        )}
        <ThemeToggle />
        <LangSwitcher />
        <MobileMenu currentUser={currentUser}/>
        <Login open={open} openHandler={setOpen} />
      </div>
    </header>
  );
}
