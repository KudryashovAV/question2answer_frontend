import { Metadata } from "next";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import Filter from "../../../components/filter";
import { UserFilters } from "@/constants/filters";
import { getAllUsers, fetchUserById } from "@/actions/user.action";
import LocalSearch from "@/components/local-search";
import UserCard from "@/components/cards/user-card";
import { SearchParamsProps } from "@/types/props";
import Pagination from "@/components/pagination";
import { cookies } from "next/headers";
import { i18n } from "../i118n";

export const metadata: Metadata = {
  title: "Wanswers| Community",
  description:
    "Wanswers is a community of developers, where you can ask questions and receive answers from other members of the community.",
};

export default async function CommunityPage({ searchParams }: SearchParamsProps) {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: Number(searchParams.page) || 1,
  });

  const getCurrentUser = async () => {
    const cookieStore = cookies();
    return JSON.parse(cookieStore.get("currentUser")?.value);
  };

  const currentUser = await getCurrentUser();

  const { users, isNext, total_pages, total_records } = result;

  const getLang = async () => {
    const cookieStore = cookies();
    return cookieStore.get("lang")?.value.toLocaleLowerCase() || "en";
  };
  const lang = await getLang();

  return (
    <>
      <h1 className="h1-bold">{i18n()[lang]["allUsers"]}</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/community"
          icon={<SearchIcon />}
          iconPosition="left"
          placeholder={i18n()[lang]["searchForAmazingMinds"]}
          className="flex-1"
        />
        {/* <Filter filters={UserFilters} /> */}
      </div>
      <section className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 min-[1700px]:grid-cols-4 min-[2200px]:grid-cols-5">
        {users.length > 0 ? (
          users.map((user: { id: any }) => (
            <UserCard key={user.id} user={user} isItCurrentUser={currentUser?.id === user.id} />
          ))
        ) : (
          <div className="paragraph-regular mx-auto max-w-4xl text-center">
            <p className="text-2xl font-semibold">{i18n()[lang]["noUsers"]}</p>
            <Link href="sign-up" className="font-bold text-accent-blue">
              {i18n()[lang]["joinUs"]}
            </Link>
          </div>
        )}
      </section>
      {isNext && (
        <Pagination
          pageNumber={Number(searchParams.page) || 1}
          isNext={isNext}
          total_pages={total_pages}
          total_records={total_records}
          records_type={i18n()[lang]["questions"].toLowerCase()}
        />
      )}
    </>
  );
}
