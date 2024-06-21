import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPinIcon } from "lucide-react";
import { SignedIn } from "@clerk/nextjs";

import { auth } from "@clerk/nextjs/server";
import { MetaDataProps, ParamsSearchProps } from "@/types/props";
import { getUserInfo } from "@/actions/user.action";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import QuestionCard from "@/components/cards/question-card";
import NoResult from "@/components/no-result";
import ParseHTML from "@/components/parse-html";
import { cookies } from "next/headers";
import { i18n } from "../../i118n";
import { SocialIcon } from "react-social-icons";
import SocialNetworkIcon from "@/components/social-network-icon";
import ContentCard from "@/components/cards/content-card";

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
    title: `Wanswers | ${userInfo?.username}`,
    description: userInfo.name,
    openGraph: {
      images: [userInfo.picture, ...previousImages],
    },
  };
}

export default async function Profile({ params, searchParams }: ParamsSearchProps) {
  const userId = auth().userId;
  const { userInfo } = await getUserInfo(params?.id!);

  const getLang = async () => {
    const cookieStore = cookies();
    return cookieStore.get("lang")?.value.toLocaleLowerCase() || "en";
  };
  const lang = await getLang();

  const userQuestionsTitle = (questionsCount: number) => {
    if (questionsCount > 0) {
      return questionsCount > 1
        ? `${questionsCount} ${i18n()[lang]["questions4"]}`
        : `${questionsCount} ${i18n()[lang]["questions3"]}`;
    } else {
      return `${i18n()[lang]["askedQuestions1"]} ${userInfo.name} ${
        i18n()[lang]["askedQuestions2"]
      }`;
    }
  };

  return (
    <div>
      <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Image
              src={userInfo.picture || "/assets/images/user_logo.jpeg"}
              alt={userInfo.name}
              width={450}
              height={450}
              className="rounded-lg"
            />

            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-dark300_light700 text-3xl font-bold tracking-tight">
                {userInfo.name}
              </h1>
              <div className="mt-5 flex flex-row">
                <div>
                  <h2 className="sr-only">{i18n()[lang]["userSocialNetworks"]}</h2>
                </div>
                {[
                  { link: userInfo?.linkedin_link, url: "www.linkedin.com" },
                  { link: userInfo?.facebook_link, url: "www.facebook.com" },
                  { link: userInfo?.instagram_link, url: "www.instagram.com" },
                  { link: userInfo?.github_link, url: "www.github.com" },
                  { link: userInfo?.youtube_link, url: "www.youtube.com" },
                  { link: userInfo?.x_link, url: "www.x.com" },
                ].map((networkUrlData: { link: string; url: string }) => (
                  <SocialNetworkIcon
                    key={networkUrlData.link}
                    link={networkUrlData.link}
                    typeUrl={networkUrlData.url}
                  />
                ))}
              </div>
              {(userInfo?.city || userInfo?.country) && (
                <div className="mt-5 flex flex-row">
                  <div>
                    <h2 className="sr-only">{i18n()[lang]["userLocation"]}</h2>
                  </div>
                  <div>
                    <MapPinIcon className="text-dark300_light700 h-8" />
                  </div>
                  <div className="text-dark300_light700 ml-2 text-xl tracking-tight">
                    {userInfo?.city},
                  </div>
                  <div className="text-dark300_light700 ml-2 text-xl tracking-tight">
                    {userInfo?.country}
                  </div>
                </div>
              )}
              <div className="mt-5">
                <h2 className="sr-only">{i18n()[lang]["prefferedLang"]}</h2>
                <p className="text-dark300_light700 text-xl tracking-tight">
                  {i18n()[lang]["prefferedLang"]}: {userInfo?.location || "en"}
                </p>
              </div>
              <div className="mt-6">
                <h3 className="sr-only">{i18n()[lang]["description"]}</h3>
                <div className="space-y-6 text-base">
                  <ParseHTML content={userInfo?.bio || ""} />
                </div>
              </div>
              <div className="mt-10">
                <SignedIn>
                  {userId === userInfo.clerk_id && (
                    <Link
                      href="/profile/edit"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "paragraph-medium text-dark300_light700 w-[220px] border-2 transition-all hover:text-orange-500",
                      )}
                    >
                      {i18n()[lang]["editProfile"]}
                    </Link>
                  )}
                </SignedIn>
              </div>
            </div>
          </div>

          <ContentCard
            questions={userInfo.questions}
            clerkId={userId}
            lang={lang}
            name={userInfo.name}
            type="question"
            link={`/?user_id=${userInfo.id}`}
          />

          <ContentCard
            questions={userInfo.answer_questions}
            clerkId={userId}
            lang={lang}
            name={userInfo.name}
            type="answer"
            link={`/?user_id=${userInfo.id}&answers=true`}
          />

          <ContentCard
            questions={userInfo.comments_questions}
            clerkId={userId}
            lang={lang}
            name={userInfo.name}
            type="comment"
            link={`/?user_id=${userInfo.id}&comments=true`}
          />
        </div>
      </main>
    </div>
  );
}
