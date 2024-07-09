"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const UserMenu = ({ user }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex justify-center gap-x-1.5 px-3 py-2 ">
          <div className="flex items-center gap-1">
            <Image
              src={user?.picture || "/assets/images/user_logo.jpeg"}
              alt="Author picture"
              width={50}
              height={44}
              className="h-[50px] w-[53px] rounded-full"
            />
            <p className="paragraph-semibold">{user?.name || "NoName"}</p>
          </div>
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="background-light900_dark200 absolute right-0 z-10 mt-2 w-full justify-center rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="flex flex-col items-center justify-center">
          <MenuItem className="block w-full px-4 py-2 text-center hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
            <Link href={`/profile/${user?.id}`}>My profile</Link>
          </MenuItem>

          <MenuItem>
            <button
              type="button"
              className="m-3 w-full rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 p-3 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default UserMenu;
