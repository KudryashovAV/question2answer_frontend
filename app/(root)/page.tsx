import { Metadata } from "next";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import Filter from "../../components/filter";
import { HomePageFilters } from "@/constants/filters";
import LocalSearch from "@/components/local-search";
import QuestionCard from "@/components/cards/question-card";
import NoResult from "@/components/no-result";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { getAllQuestions } from "@/actions/question.action";
import { SearchParamsProps } from "@/types/props";
import Pagination from "@/components/pagination";
import { Key, useEffect, useState } from "react";
import { cookies } from "next/headers";
import { i18n } from "./i118n";
import { getCookie } from "cookies-next";

export const metadata: Metadata = {
  title: "Wanswers | Home",
  description:
    "Wanswers is a community of developers, where you can ask questions and receive answers from other members of the community.",
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const getLang = async () => {
    const cookieStore = cookies();
    return cookieStore.get("lang")?.value.toLocaleLowerCase() || "en";
  };

  const getCurrentUser = async () => {
    const cookieStore = cookies();
    return JSON.parse(cookieStore.get("currentUser")?.value)
  };
  const lang = await getLang();
  const currentUser = await getCurrentUser();

  const result = await getAllQuestions({
    searchQuery: searchParams,
    location: lang,
    page: Number(searchParams.page) || 1,
  });
  const { questions, isNext, total_pages, total_records } = result;
  console.log("current_user_id", currentUser.id);

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h1 className="h1-bold">{i18n()[lang]["mainQuestiinHeader"]}</h1>
        <Link href="ask-question" className={cn(buttonVariants(), "primary-gradient text-white")}>
          {i18n()[lang]["askQuestion"]}
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          icon={<SearchIcon />}
          iconPosition="left"
          placeholder={i18n()[lang]["searchQuestions"]}
          className="flex-1"
        />
        <Filter filters={HomePageFilters} containerClass="sm:min-w-[170px] md:hidden" />
      </div>
      {/* <HomeFilter /> */}
      <div className="mt-10 flex flex-col gap-5">
        {questions.length > 0 ? (
          questions.map((question: { id: Key | null | undefined }) => (
            <QuestionCard key={question.id} question={question} currentUserId={currentUser.id} />
          ))
        ) : (
          <NoResult
            title={i18n()[lang]["noResultQTitle"]}
            description={i18n()[lang]["noResultQDescription"]}
            buttonText={i18n()[lang]["askQuestion"]}
            buttonLink="/ask-question"
          />
        )}
      </div>
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
