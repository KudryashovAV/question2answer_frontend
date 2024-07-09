"use client";

import { ThemeToggle } from "./theme-toggle";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";
import { LangSwitcher } from "./lang-switcher";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { createUser } from "@/actions/user.action";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { Button, buttonVariants } from "@/components/ui/button";
import UserMenu from "@/components/user-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { i18n } from "@/app/(root)/i118n";
import Login from "@/components/login";

export default function Header() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [lang, setLang] = useState("en");
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  //GOOGLE { user: {email: "hekpomamohtehok@gmail.com", image: "https://lh3.googleusercontent.com/a/ACg8ocLL07qXFmBt8se6on89wbec-OgJ1-pr5C5r2bDauBGrTtYx07mS=s96-c", name: "алексей кудряшов" }}
  //GITHUB { user: { email: "akd@krononsoft.com", image: "https://avatars.githubusercontent.com/u/6435860?v=4", name: "KudryashovAV"}}

  useEffect(() => {
    if (session && !currentUser) {
      const payload = {
        name: session.user?.name,
        email: session.user?.email,
        picture: session.user?.image,
        type: "create",
      };

      const getCurrentUser = async () => {
        const response = await createUser(payload);
        setCurrentUser(response);
      };

      getCurrentUser();
    } else if (!session && currentUser) {
      setCurrentUser(null);
      deleteCookie("currentUser");
    }
  }, [session]);

  let login = i18n()[lang]["login"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    login = i18n()[lang]["login"];
  }, []);

  useEffect(() => {
    if (window && currentUser) {
      setCookie(
        "currentUser",
        JSON.stringify({
          name: currentUser.name,
          email: currentUser.email,
          id: currentUser.id,
          picture: currentUser.picture,
        }),
      );
    }
  }, [currentUser]);

  return (
    <header className="flex-between background-light900_dark200 sticky top-0 z-50 h-20 w-full gap-5 px-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Logo />
      <div className="flex-between gap-5">
        {session ? (
          currentUser && <UserMenu user={currentUser} />
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
        <MobileMenu />
        <Login open={open} openHandler={setOpen} />
      </div>
    </header>
  );
}
