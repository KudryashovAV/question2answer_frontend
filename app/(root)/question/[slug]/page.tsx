import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { MetaDataSlugProps, ParamsSearchSlugProps } from "@/types/props";
import { getQuestionById } from "@/actions/question.action";
import getTimeStamp from "@/utils/getTimeStamp";
import AllAnswers from "@/components/all-answers";
import AnswerForm from "@/components/forms/answer-form";
import ParseHTML from "@/components/parse-html";
import { TagBadge } from "@/components/tags-badge";
import AllComments from "@/components/all-comments";
import { cookies } from "next/headers";
import { i18n } from "../../i118n";
import NoResult from "@/components/no-result";

export async function generateMetadata(
  { params }: MetaDataSlugProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const slug = params.slug;
  // fetch data
  const question = await getQuestionById(slug);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || [];

  return {
    title: question.title,
    description: question.content,
    // openGraph: {
    //   images: [...previousImages],
    // },
  };
}

export default async function QuestionDetailPage({ params, searchParams }: ParamsSearchSlugProps) {
  const getLang = async () => {
    const cookieStore = cookies();
    return cookieStore.get("lang")?.value.toLocaleLowerCase() || "en";
  };
  const lang = await getLang();
  const question = await getQuestionById(params.slug);

  const getCurrentUser = async () => {
    const cookieStore = cookies();
    return JSON.parse(cookieStore.get("currentUser")?.value);
  };

  const currentUser = await getCurrentUser();

  if (Object.keys(question).length == 0)
    return (
      <NoResult
        title={i18n()[lang]["noResultForQPageTitle"]}
        description={i18n()[lang]["noResultQDescription"]}
        buttonText={i18n()[lang]["askQuestion"]}
        buttonLink="/ask-question"
      />
    );

  const { title, content, answers, created_at, tags, user_id, user_name, user_image, comments } =
    question;

  const currentUserId = currentUser?.id;
  const questionId = question?.id;

  return (
    <>
      <div>
        <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
          <Link href={`/profile/${user_id}`} className="flex items-center gap-1">
            <Image
              src={user_image || "/assets/images/user_logo.jpeg"}
              alt="Author picture"
              width={25}
              height={22}
              className="h-[25px] w-[26.5px] rounded-full"
            />
            <p className="paragraph-semibold">{user_name}</p>
          </Link>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5">{title}</h2>
        <div className="small-medium mb-8 mt-5 flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {i18n()[lang]["asked"]} {getTimeStamp(new Date(created_at))} {i18n()[lang]["ago"]}
          </div>
        </div>
      </div>
      <ParseHTML content={content} />
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {tags.map((tag: any) => (
          <TagBadge key={tag.id}>{tag.name}</TagBadge>
        ))}
      </div>
      <AllComments
        ownerId={questionId}
        ownerType="question"
        comments={comments}
        currentUserId={currentUserId}
        defaultCommentsCount={2}
      />
      <AllAnswers answers={answers} currentUserId={currentUserId} />
      <AnswerForm
        questionId={questionId}
        userId={currentUserId}
        questionTitleContent={`${question.title}\n${question.content}`}
      />
    </>
  );
}
