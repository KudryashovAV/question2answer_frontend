import { Metadata } from "next";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { SearchParamsProps } from "@/types/props";
import { TagFilters } from "@/constants/filters";
import { tagNoResult } from "@/constants/no-result";
import { getAllTags } from "@/actions/tag.action";
import LocalSearch from "@/components/local-search";
import Filter from "@/components/filter";
import NoResult from "@/components/no-result";
import { tagVariants } from "@/components/tags-badge";
import { cn } from "@/lib/utils";
import Pagination from "@/components/pagination";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
} from "react";
import { i18n } from "../i118n";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Wanswers | Tags",
  description:
    "Tags are a means of connecting experts with questions they will be able to answer by sorting questions into specific, well-defined categories.",
};

export default async function TagsPage({ searchParams }: SearchParamsProps) {
  const result = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: Number(searchParams.page) || 1,
  });
  const { tags, isNext } = result;

  const getLang = async () => {
    const cookieStore = cookies();
    return cookieStore.get("lang")?.value.toLocaleLowerCase() || "en";
  };
  const lang = await getLang();

  return (
    <>
      <h1 className="h1-bold">{i18n()[lang]["allTags"]}</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/tags"
          icon={<SearchIcon />}
          iconPosition="left"
          placeholder={i18n()[lang]["searchForTags"]}
          className="flex-1"
        />
        {/* <Filter filters={TagFilters} /> */}
      </div>
      <section className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-4">
        {tags.length > 0 ? (
          tags.map(
            (tag: {
              questions_count: ReactNode;
              id: Key | null | undefined;
              name: string | undefined;
            }) => (
              <Link
                href={`tags/${tag.id}`}
                key={tag.id}
                className="rounded-lg bg-gray-100 dark:bg-dark-200"
              >
                <article key={tag.id} className="flex w-full flex-col items-center gap-3 p-5">
                  <div>
                    <p
                      className={cn(
                        tagVariants({ size: "md" }),
                        "background-light700_dark300 font-semibold shadow",
                      )}
                    >
                      {tag.name}
                    </p>
                  </div>
                  <p className="text-dark400_light500 text-sm">
                    <span className="primary-text-gradient mr-2 font-semibold">
                      {tag.questions_count}+
                    </span>
                    {i18n()[lang]["questions2"]}
                  </p>
                </article>
              </Link>
            ),
          )
        ) : (
          <NoResult
            title={tagNoResult.title}
            description={tagNoResult.description}
            buttonText={tagNoResult.buttonText}
            buttonLink={tagNoResult.buttonLink}
          />
        )}
      </section>
      <Pagination pageNumber={Number(searchParams.page) || 1} isNext={isNext} />
    </>
  );
}
