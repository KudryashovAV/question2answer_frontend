import Link from 'next/link';
import Image from 'next/image';
import { getTopInteractedTags } from '@/actions/tag.action';
import { TagBadge } from '../tags-badge';
import getFormatNumber from '@/utils/getFormatNumber';
import { MessageCircle } from 'lucide-react';
import { BadgeHelp } from 'lucide-react';

export default async function UserCard({ user }: any) {
  // const interactedTags = await getTopInteractedTags({ userId: user.id });
  return (
    <Link
      href={`/profile/${user.id}`}
      className="overflow-hidden rounded-2xl border bg-gray-100 shadow transition-all hover:shadow-md dark:bg-dark-300"
    >
      <article className="shadow-light100_darknone item-center flex flex-col items-center justify-center p-8">
        {/* <Image
          src={user.picture}
          alt={user.name}
          width={100}
          height={100}
          className="h-[80px] w-[80px] rounded-full"
        /> */}
        <div className="mt-4 text-center">
          <h3 className="line-clamp-1 text-xl font-bold md:text-2xl" title={user.name}>
            {user.name}
          </h3>
          <p className="mt-2 font-medium text-gray-500 dark:text-gray-400">@{user.user_name}</p>
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
              <div className="flex items-center gap-1">
                <BadgeHelp className="h-3.5 w-3.5 stroke-foreground" />
                {getFormatNumber(user.questions_count || 0)}{' '}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5 stroke-foreground" />
                {getFormatNumber(user.answers_count || 0)}{' '}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
