import { Metadata, ResolvingMetadata } from "next";
import { SearchIcon } from "lucide-react";
import { MetaDataProps, ParamsSearchProps } from "@/types/props";
import { getQuestionsByTagId } from "@/actions/tag.action";
import { tagQuestionNoResult } from "@/constants/no-result";
import LocalSearch from "@/components/local-search";
import NoResult from "@/components/no-result";
import QuestionCard from "@/components/cards/question-card";
import Pagination from "@/components/pagination";
import { cookies } from "next/headers";
import { i18n } from "../../i118n";

export async function generateMetadata(
  { params }: MetaDataProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = params.id;
  // fetch data
  const tag = await getQuestionsByTagId({ tagId: id });
  const { tagName } = tag;
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `Wanswers | Tag - ${tagName}`,
    openGraph: {
      images: ["/some-specific-page-image.jpg", ...previousImages],
    },
  };
}

export default async function TagDetailsPage({ params, searchParams }: ParamsSearchProps) {
  const tag = await getQuestionsByTagId({
    tagId: params.id,
    searchQuery: searchParams.q,
    page: Number(searchParams.page) || 1,
  });

  const { tagName, questions, isNext } = tag;
  const getLang = async () => {
    const cookieStore = cookies();
    return cookieStore.get("lang")?.value.toLocaleLowerCase() || "en";
  };
  const lang = await getLang();
  return (
    <>
      <h1 className="h1-bold text-dark300_light700 uppercase">{tagName}</h1>
      <div className="mt-11">
        <LocalSearch
          route={`/tags/${params.id}`}
          icon={<SearchIcon />}
          iconPosition="left"
          placeholder={i18n()[lang]["tagSearch"]}
          className="flex-1"
        />
      </div>
      <div className="mt-10 flex flex-col gap-5">
        {questions.length > 0 ? (
          questions.map((question: any) => <QuestionCard key={question.id} question={question} />)
        ) : (
          <NoResult
            title={i18n()[lang]["noResultTTitle"]}
            description={i18n()[lang]["noResultQDescription"]}
            buttonText={i18n()[lang]["askQuestion"]}
            buttonLink="/ask-question"
          />
        )}
      </div>
      <Pagination pageNumber={Number(searchParams.page) || 1} isNext={isNext} />
    </>
  );
}
