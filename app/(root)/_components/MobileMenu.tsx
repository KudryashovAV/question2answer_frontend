"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { i18n } from "../i118n";
import { signIn, signOut, useSession } from "next-auth/react";

type SidebarLink = {
  imgURL: string;
  route: string;
  label: string;
};

export default function MobileMenu() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (window && getCookie("currentUser") && getCookie("currentUser") !== "undefined") {
      const currentUser = JSON.parse(getCookie("currentUser"));
      setCurrentUser(currentUser);
    }
  }, []);

  const [lang, setLang] = useState("en");

  let questionsLabel = i18n()[lang]["questions"];
  let usersLabel = i18n()[lang]["users"];
  let tagsLabel = i18n()[lang]["tags"];
  let profileLabel = i18n()[lang]["profile"];
  let askQuestionLabel = i18n()[lang]["askQuestion"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    questionsLabel = i18n()[lang]["questions"];
    usersLabel = i18n()[lang]["users"];
    tagsLabel = i18n()[lang]["tags"];
    profileLabel = i18n()[lang]["profile"];
    askQuestionLabel = i18n()[lang]["askQuestion"];
  }, []);

  const sidebarLinks: SidebarLink[] = [
    {
      imgURL: "/assets/icons/home.svg",
      route: "/",
      label: i18n()[lang]["questions"],
    },
    {
      imgURL: "/assets/icons/users.svg",
      route: "/community",
      label: i18n()[lang]["users"],
    },
    {
      imgURL: "/assets/icons/tag.svg",
      route: "/tags",
      label: i18n()[lang]["tags"],
    },
    {
      imgURL: "/assets/icons/user.svg",
      route: "/profile",
      label: i18n()[lang]["profile"],
    },
    {
      imgURL: "/assets/icons/question.svg",
      route: "/ask-question",
      label: i18n()[lang]["askQuestion"],
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden">
          <MenuIcon className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <Logo />
        <div className="flex h-full flex-col justify-between py-10">
          <div className="flex flex-col gap-y-1">
            {sidebarLinks.map((item) => {
              const isActive =
                (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;
              if (item.route === "/profile") {
                if (currentUser?.name) {
                  item.route = `/profile/${currentUser.name}`;
                } else {
                  return null;
                }
              }
              return (
                <SheetClose asChild key={item.route}>
                  <Link
                    href={item.route}
                    className={`text-dark300_light900 flex items-center gap-3 rounded-md p-4 text-sm opacity-75 ${
                      isActive && "primary-gradient opacity-100"
                    }`}
                  >
                    <Image
                      src={item.imgURL}
                      alt={item.label}
                      width={20}
                      height={20}
                      className={`${isActive || "invert-colors"}`}
                    />
                    <span className={`${isActive ? "font-bold" : "font-medium"}`}>
                      {item.label}
                    </span>
                  </Link>
                </SheetClose>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
