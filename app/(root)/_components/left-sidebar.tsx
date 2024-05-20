"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedOut } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserCircle, UserPlus } from "lucide-react";
import { getCookie } from "cookies-next";
import { i18n } from "../i118n";
import { useState, useEffect } from "react";

type SidebarLink = {
  imgURL: string;
  route: string;
  label: string;
};

export default function LeftSidebar({ loggedInUserId }: { loggedInUserId: string | null }) {
  const pathname = usePathname();
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

  const isActive = (route: string) => {
    if (pathname === `/profile/${loggedInUserId}` && route.includes("profile")) {
      return true;
    } else if (pathname.includes(route) && route.length > 1) {
      return true;
    } else if (pathname === route) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <aside className="background-light900_dark200 sticky left-0 top-20 flex h-[calc(100vh-5rem)] flex-col border-r p-5 dark:shadow-none max-sm:hidden lg:w-[250px]">
      <div className="flex h-screen flex-col justify-between">
        <div className="flex flex-col gap-1">
          {sidebarLinks.map((item) => {
            if (item.route === "/profile") {
              if (loggedInUserId) {
                item.route = `/profile/${loggedInUserId}`;
              } else {
                return null;
              }
            }
            return (
              <Link
                key={item.route}
                href={item.route}
                className={`flex items-center gap-3 rounded-md p-4 text-sm ${
                  isActive(item.route) && "primary-gradient"
                }`}
              >
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={`${isActive(item.route) || "invert-colors"}`}
                />
                <span
                  className={`${isActive(item.route) ? "font-bold" : "font-medium"} max-lg:hidden`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        <SignedOut>
          <div className="flex flex-col gap-3">
            <Link
              href="/sign-in"
              className={cn(buttonVariants(), "btn-secondary small-medium w-full text-orange-500")}
            >
              <UserCircle className="h-5 w-5 lg:hidden" />
              <span className="max-lg:hidden">{i18n()[lang]["login"]}</span>
            </Link>
            <Link
              href="/sign-up"
              className={cn(buttonVariants(), "btn-tertiary text-dark400_light900 w-full")}
            >
              <UserPlus className="h-5 w-5 lg:hidden" />
              <span className="max-lg:hidden">{i18n()[lang]["signup"]}</span>
            </Link>
          </div>
        </SignedOut>
      </div>
    </aside>
  );
}
