import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { tagVariants } from "../tags-badge";
import getTimeStamp from "@/utils/getTimeStamp";
import getFormatNumber from "@/utils/getFormatNumber";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { i18n } from "@/app/(root)/i118n";

interface Props {
  question: any;
  clerkId?: string | null;
}

export default async function QuestionCard({ question, clerkId }: Props) {
  const getLang = async () => {
    const cookieStore = cookies();
    return cookieStore.get("lang")?.value.toLocaleLowerCase() || "en";
  };
  const lang = await getLang();
  const { user_id, slug, user_name, user_image, title, created_at, answers_count } = question;

  // const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-lg p-9 sm:px-11">
      <div className="flex flex-col">
        <p className="subtle-regular text-dark400_light700 lg:hidden">
          {getTimeStamp(new Date(created_at))} {i18n()[lang]["ago"]}
        </p>
        <div className="flex items-center justify-between">
          <Link href={`/question/${slug}`}>
            <h3 className="h3-semibold text-dark200_light900 line-clamp-1">{title}</h3>
          </Link>
          {/* <SignedIn>
            {showActionButtons && <EditDeleteAction type="Question" itemId={id} />}
          </SignedIn> */}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-3">
        {question.tags.map((tag: any) => (
          <Link href={`/tags/${tag.id}`} key={tag.id} className={cn(tagVariants({ size: "sm" }))}>
            {tag.name}
          </Link>
        ))}
      </div>
      <div>
        <hr className="mt-2" />
        <div className="small-medium mt-2 flex justify-between gap-3 text-slate-400 max-md:flex-col">
          <div className="flex items-center gap-1">
            <Link href={`/profile/${user_id}`} className="flex items-center gap-2">
              <Image
                src={user_image || "/assets/images/user_logo.jpeg"}
                alt={user_name}
                width={25}
                height={25}
                className="h-5 w-5 rounded-full"
              />
              <p className="text-[13px] hover:underline">{user_name}</p>
            </Link>
            <p className="subtle-regular text-dark400_light700 hidden lg:flex">
              - {i18n()[lang]["asked"]} {getTimeStamp(new Date(created_at))} {i18n()[lang]["ago"]}
            </p>
          </div>
          <div className="flex items-center gap-4 max-md:justify-end max-sm:justify-between">
            <div className="flex items-center gap-1">
              {/* <ThumbsUp className="h-3.5 w-3.5 stroke-blue-500" /> */}
              {/* {getFormatNumber(upvotes.length)} {upvotes.length > 1 ? 'Votes' : 'Vote'} */}
              {/* Vote */}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5 stroke-foreground" />
              {getFormatNumber(question.answers_count)}{" "}
              {answers_count > 1 ? i18n()[lang]["answers"] : i18n()[lang]["answer"]}
            </div>
            <div className="flex items-center gap-1">
              {/* <Eye className="h-3.5 w-3.5 stroke-slate-500" /> */}
              {/* {getFormatNumber(views)} {views > 1 ? 'Views' : 'View'} */}
            </div>
          </div>
        </div>
        <hr className="mt-2" />
      </div>
    </div>
  );
}
