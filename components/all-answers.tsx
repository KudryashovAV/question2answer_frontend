"use client";

import Link from "next/link";
import ParseHTML from "./parse-html";
import Image from "next/image";
import { Key, useEffect, useState } from "react";
import AllComments from "./all-comments";
import { IComments } from "@/types/props";
import { i18n } from "@/app/(root)/i118n";
import { getCookie } from "cookies-next";
import { getTimeStamp } from "@/lib/utils";

interface IAnswer {
  id: string | Key | null | undefined;
  user_id: number | string;
  created_at: Date | string;
  user_name: string;
  user_picture: string | null;
  comments: IComments[];
  content: string;
}

interface Props {
  answers: IAnswer[];
  currentUserId: string | null;
}

export default function AllAnswers({ answers, currentUserId }: Props) {
  const [lang, setLang] = useState("en");

  let ago = i18n()[lang]["ago"];
  let answered = i18n()[lang]["answered"];
  let answersTitle = i18n()[lang]["answers"];
  let answerTitle = i18n()[lang]["answer"];
  let noAnswers = i18n()[lang]["noAnswer"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    ago = i18n()[lang]["ago"];
    answered = i18n()[lang]["answered"];
    answersTitle = i18n()[lang]["answers"];
    answerTitle = i18n()[lang]["answer"];
    noAnswers = i18n()[lang]["noAnswer"];
  }, []);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const pageTitle = () => {
    if (answers.length === 0) {
      return noAnswers;
    } else if (answers.length === 1) {
      return `${answers.length} ${capitalizeFirstLetter(answerTitle)}`;
    } else {
      return `${answers.length} ${capitalizeFirstLetter(answersTitle)}`;
    }
  };

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{pageTitle()}</h3>
        {/* <Filter filters={AnswerFilters} /> */}
      </div>
      <hr className="h-0.5 border-t-0 bg-neutral-100 dark:bg-white/20" />
      <div>
        {answers.map((answer: IAnswer) => (
          <article key={answer.id} className="light-border border-b py-10">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <Link href={`/profile/${answer.user_id}`} className="flex gap-2">
                  <Image
                    src={answer.user_picture || "/assets/images/user_logo.jpeg"}
                    alt="Author picture"
                    width={22}
                    height={22}
                    className="h-6 w-6 rounded-full"
                  />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-end">
                    <p className="body-semibold text-dark300_light700">{answer.user_name}</p>
                    <p className="text-light400_light500 text-xs">
                      <span className="max-sm:hidden"> - </span>
                      {answered} {getTimeStamp(new Date(answer.created_at))} {ago}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="text-light400_light500 text-xs">
              <ParseHTML content={answer.content} />
            </div>
            <AllComments
              ownerId={answer.id}
              ownerType="answer"
              comments={answer.comments}
              currentUserId={currentUserId}
              defaultCommentsCount={0}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
