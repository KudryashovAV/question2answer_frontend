import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDaysIcon, LinkIcon, MapPinIcon } from 'lucide-react';
import { SignedIn, auth } from '@clerk/nextjs';
import { MetaDataProps, ParamsSearchProps } from '@/types/props';
import { getUserInfo } from '@/actions/user.action';
import getJoinedDate from '@/utils/getJoinedDate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Stats from '@/components/stats';
import QuestionsTab from '@/components/questions-tab';
import AnswerTabs from '@/components/answers-tab';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export async function generateMetadata(
  { params }: MetaDataProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const userInfo: any = await getUserInfo(id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Dev Overflow | ${userInfo?.username}`,
    description: userInfo.name,
    openGraph: {
      images: [userInfo.picture, ...previousImages],
    },
  };
}

export default async function Profile({ params, searchParams }: ParamsSearchProps) {
  const { userId: clerkId } = auth();
  const userInfo: any = await getUserInfo(params?.id!);

  return (
    <>
      <div className="flex flex-col gap-5 md:flex-row md:justify-between">
        <div>
          <Image
            src={userInfo.picture}
            alt={userInfo.name}
            width={150}
            height={150}
            className="rounded-lg"
          />
          <div className="mt-3">
            <h2 className="h2-bold">{userInfo.name}</h2>
            <p className="font-medium text-slate-600 dark:text-slate-400">@{userInfo.username}</p>
          </div>

          <div className="mt-5 flex items-center gap-5">
            {userInfo.location && (
              <div>
                <a href={userInfo?.portfolio} className="flex items-center">
                  <LinkIcon className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-accent-blue">Portfolio</span>
                </a>
              </div>
            )}
            {userInfo.location && (
              <div className="flex items-center">
                <MapPinIcon className="mr-2 h-4 w-4 text-gray-500" />
                {userInfo?.location}
              </div>
            )}
            <div className="flex items-center">
              <CalendarDaysIcon className="mr-2 h-4 w-4 text-gray-500" /> Joined{' '}
              {getJoinedDate(new Date(userInfo.created_at))}
            </div>
          </div>
          {userInfo.bio && (
            <p className="paragraph-regular text-dark400_light800 mt-8">{userInfo?.bio}</p>
          )}
        </div>
        <div>
          <SignedIn>
            {clerkId === userInfo.clerkId && (
              <Link
                href="/profile/edit"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'paragraph-medium text-dark300_light700 w-[200px] border-2 transition-all hover:text-orange-500',
                )}
              >
                Edit profile
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      {/* <Stats
        totalQuestions={userInfo.questions_count}
        totalAnswers={userInfo.answers_count}
        reputation={0}
        badges={0}
      />
      <div>
        <Tabs defaultValue="top-posts" className="mt-10">
          <TabsList className="mb-2">
            <TabsTrigger
              value="top-posts"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-500"
            >
              Top Posts
            </TabsTrigger>
            <TabsTrigger
              value="answers"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-500"
            >
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionsTab userId={userInfo.id} searchParams={searchParams} />
          </TabsContent>
          <TabsContent value="answers">
            <AnswerTabs userId={userInfo.id} searchParams={searchParams} />
          </TabsContent>
        </Tabs>
      </div> */}
    </>
  );
}
