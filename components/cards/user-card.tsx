import Link from "next/link";
import Image from "next/image";
import getFormatNumber from "@/utils/getFormatNumber";
import { MessageCircle, BadgeHelp, MessagesSquare } from "lucide-react";

export default async function UserCard({ user, isItCurrentUser }: any) {
  // const interactedTags = await getTopInteractedTags({ userId: user.id });

  const currentBg = isItCurrentUser ? "bg-dark-400" : "bg-dark-300";

  return (
    <Link
      href={`/profile/${user.id}`}
      className={`overflow-hidden rounded-2xl border bg-gray-100 shadow transition-all hover:shadow-md dark:${currentBg}`}
    >
      <article className="shadow-light100_darknone item-center flex flex-col items-center justify-center p-8">
        <Image
          src={user.picture || "/assets/images/user_logo.jpeg"}
          alt={user.name}
          width={120}
          height={120}
          className="h-[95px] w-[101px] rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="mb-5 line-clamp-1 text-xl font-bold md:text-sm" title={user.name}>
            {isItCurrentUser ? "My profile" : ""}
          </h3>

          <h3 className="line-clamp-1 text-xl font-bold md:text-2xl" title={user.name}>
            {user.name}
          </h3>

          <div className="mt-5">
            {/* {interactedTags?.length ? (
              <div className="flex items-center gap-2">
                {interactedTags.map((tag: any) => (
                  <TagBadge key={tag._id} size="sm" className="px-3">
                    {tag.name}
                  </TagBadge>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-gray-500 dark:text-gray-400">No tags yet</p>
            )} */}

            <div className="flex items-center gap-4 max-md:justify-end max-sm:justify-between">
              <div title="Asked questions" className="flex items-center gap-1">
                <BadgeHelp className="h-3.5 w-3.5 stroke-foreground" />
                {getFormatNumber(user.q_count || 0)}{" "}
              </div>
              <div title="Given answers" className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5 stroke-foreground" />
                {getFormatNumber(user.a_count || 0)}{" "}
              </div>
              <div title="Left comments" className="flex items-center gap-1">
                <MessagesSquare className="h-3.5 w-3.5 stroke-foreground" />
                {getFormatNumber(user.c_count || 0)}{" "}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
