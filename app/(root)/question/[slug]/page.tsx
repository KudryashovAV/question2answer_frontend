import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { MetaDataProps, ParamsSearchProps } from "@/types/props";
import { getQuestionById } from "@/actions/question.action";
import { getUserByClerkId } from "@/actions/user.action";
import getFormatNumber from "@/utils/getFormatNumber";
import getTimeStamp from "@/utils/getTimeStamp";
import AllAnswers from "@/components/all-answers";
import AnswerForm from "@/components/forms/answer-form";
import ParseHTML from "@/components/parse-html";
import { TagBadge } from "@/components/tags-badge";
import AllComments from "@/components/all-comments";
import { cookies } from "next/headers";
import { i18n } from "../../i118n";

export async function generateMetadata(
  { params }: MetaDataProps,
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

export default async function QuestionDetailPage({ params, searchParams }: ParamsSearchProps) {
  const question = await getQuestionById(params.slug);
  const { title, content, answers, created_at, tags, user_id, user_name, user_picture, comments } =
    question;
  const clerkId = auth().userId;

  const currentUser = await getUserByClerkId(clerkId!);
  // warning: mongodb objectId can not be passed as props from server component to client component
  const currentUserId = currentUser?.id;
  const questionId = question?.id;

  console.log("currentUserClerkId", clerkId);

  const getLang = async () => {
    const cookieStore = cookies();
    return cookieStore.get("lang")?.value.toLocaleLowerCase() || "en";
  };
  const lang = await getLang();

  return (
    <>
      <div>
        <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
          <Link href={`profile/${user_id}`} className="flex items-center gap-1">
            <Image
              src={user_picture || "/assets/images/user_logo.jpeg"}
              alt="Author picture"
              width={22}
              height={22}
              className="rounded-full"
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
