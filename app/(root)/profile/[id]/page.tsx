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
                <SocialIcon
                  className="mr-2"
                  style={{ width: "40px", height: "40px" }}
                  url="www.linkedin.com"
                  href={userInfo?.linkedin_link || "#"}
                />
                <SocialIcon
                  className="mr-2"
                  style={{ width: "40px", height: "40px" }}
                  url="www.facebook.com"
                  href={userInfo?.facebook_link || "#"}
                />
                <SocialIcon
                  className="mr-2"
                  style={{ width: "40px", height: "40px" }}
                  url="www.instagram.com"
                  href={userInfo?.instagram_link || "#"}
                />
                <SocialIcon
                  className="mr-2"
                  style={{ width: "40px", height: "40px" }}
                  url="www.github.com"
                  href={userInfo?.github_link || "#"}
                />
                <SocialIcon
                  className="mr-2"
                  style={{ width: "40px", height: "40px" }}
                  url="www.youtube.com"
                  href={userInfo?.youtube_link || "#"}
                />
                <SocialIcon
                  className="mr-2"
                  style={{ width: "40px", height: "40px" }}
                  url="www.x.com"
                  href={userInfo?.x_link || "#"}
                />
              </div>
              <div className="mt-5 flex flex-row">
                <div>
                  <h2 className="sr-only">{i18n()[lang]["userLocation"]}</h2>
                </div>
                <div>
                  <MapPinIcon className="text-dark300_light700 h-8" />
                </div>
                <div className="text-dark300_light700 ml-2 text-xl tracking-tight">
                  {userInfo?.country || "Great Britain"},
                </div>
                <div className="text-dark300_light700 ml-2 text-xl tracking-tight">
                  {userInfo?.city || "London"}
                </div>
              </div>
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

          <section
            aria-labelledby="related-heading"
            className="mt-10 border-t border-gray-200 px-4 py-16 sm:px-0"
          >
            <h2 id="related-heading" className="text-dark300_light700 text-xl font-bold">
              {i18n()[lang]["askedQuestions"]}
            </h2>

            <div className="mt-10 flex flex-col gap-5">
              {userInfo.questions.length > 0 ? (
                userInfo.questions
                  .slice(0, 2)
                  .map((question: any) => (
                    <QuestionCard key={question.id} question={question} clerkId={userId!} />
                  ))
              ) : (
                <NoResult
                  title={i18n()[lang]["noResultQTitle"]}
                  description={i18n()[lang]["noResultQDescription"]}
                  buttonText={i18n()[lang]["askQuestion"]}
                  buttonLink="/ask-question"
                />
              )}
            </div>
            <div className="mt-10 flex flex-row justify-end space-x-1 hover:text-orange-500 md:flex md:flex-grow">
              {userInfo.questions.length > 1 && (
                <Link href={`/?user_id=${userInfo.id}`}>
                  {i18n()[lang]["allQuestions"]}
                  {` (${userInfo.questions.length}) >>`}
                </Link>
              )}
            </div>
          </section>

          <section
            aria-labelledby="related-heading"
            className="mt-10 border-t border-gray-200 px-4 py-16 sm:px-0"
          >
            <h2 id="related-heading" className="text-dark300_light700 text-xl font-bold">
              {i18n()[lang]["givenAnswers"]}
            </h2>

            <div className="mt-10 flex flex-col gap-5">
              {userInfo.answer_questions.length > 0 ? (
                userInfo.answer_questions
                  .slice(0, 2)
                  .map((question: any) => (
                    <QuestionCard key={question.id} question={question} clerkId={userId!} />
                  ))
              ) : (
                <NoResult
                  title={i18n()[lang]["noResultQTitle"]}
                  description={i18n()[lang]["noResultQDescription"]}
                  buttonText={i18n()[lang]["askQuestion"]}
                  buttonLink="/ask-question"
                />
              )}
            </div>
            <div className="mt-10 flex flex-row justify-end space-x-1 hover:text-orange-500 md:flex md:flex-grow">
              {userInfo.answer_questions.length > 1 && (
                <Link href={`/?user_id=${userInfo.id}&answers=true`}>
                  {i18n()[lang]["allQuestions"]}
                  {` (${userInfo.answer_questions.length}) >>`}
                </Link>
              )}
            </div>
          </section>

          <section
            aria-labelledby="related-heading"
            className="mt-10 border-t border-gray-200 px-4 py-16 sm:px-0"
          >
            <h2 id="related-heading" className="text-dark300_light700 text-xl font-bold">
              {i18n()[lang]["leftComments"]}
            </h2>

            <div className="mt-10 flex flex-col gap-5">
              {userInfo.comments_questions.length > 0 ? (
                userInfo.comments_questions
                  .slice(0, 2)
                  .map((question: any) => (
                    <QuestionCard key={question.id} question={question} clerkId={userId!} />
                  ))
              ) : (
                <NoResult
                  title={i18n()[lang]["noResultQTitle"]}
                  description={i18n()[lang]["noResultQDescription"]}
                  buttonText={i18n()[lang]["askQuestion"]}
                  buttonLink="/ask-question"
                />
              )}
            </div>
            <div className="mt-10 flex flex-row justify-end space-x-1 hover:text-orange-500 md:flex md:flex-grow">
              {userInfo.comments_questions.length > 1 && (
                <Link href={`/?user_id=${userInfo.id}&comments=true`}>
                  {i18n()[lang]["allQuestions"]}
                  {` (${userInfo.comments_questions.length}) >>`}
                </Link>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
