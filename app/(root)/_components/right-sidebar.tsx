import { getTopQuestions } from "@/actions/question.action";
import { getPopularTags } from "@/actions/tag.action";
import { TagBadge } from "@/components/tags-badge";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Key } from "react";
import { i18n } from "../i118n";
import { cookies } from "next/headers";

export default async function RightSidebar() {
  const getLang = async () => {
    const cookieStore = cookies();
    return cookieStore.get("lang")?.value.toLocaleLowerCase() || "en";
  };
  const lang = await getLang();

  const { questions } = await getTopQuestions(lang);
  const popularTags = await getPopularTags();

  return (
    <aside className="background-light900_dark200 sticky right-0 top-20 flex h-[calc(100vh-5rem)] flex-col justify-between border-l p-5 dark:shadow-none max-xl:hidden max-sm:hidden lg:w-[350px]">
      <div>
        <h3 className="h3-bold">{i18n()[lang]["topQuestions"]}</h3>
        <div className="mt-5 space-y-7">
          {questions.map(
            (question: {
              id: Key | null | undefined;
              title: string | undefined;
              slug: string | undefined;
            }) => (
              <Link
                key={question.id}
                href={`/question/${question.slug}`}
                className="group flex items-center justify-between"
              >
                <span className="body-medium text-dark500_light700">{question.title}</span>
                <ChevronRight className="h-4 w-4 text-gray-500 transition-all ease-in group-hover:translate-x-1.5" />
              </Link>
            ),
          )}
        </div>
      </div>
      <div>
        <h3 className="h3-bold">{i18n()[lang]["topTags"]}</h3>
        <div className="mt-5 space-y-3">
          {popularTags.map(
            (tag: { count: number; id: Key | null | undefined; name: string | undefined }) => (
              <div key={tag.id} className="flex items-center justify-between">
                <Link href={`/tags/${tag.id}`}>
                  <TagBadge size="sm" className="bg-slate-100">
                    {tag.name}
                  </TagBadge>
                </Link>
                <p className="dark50_light50 text-xs font-medium">{tag.count}</p>
              </div>
            ),
          )}
        </div>
      </div>
    </aside>
  );
}
